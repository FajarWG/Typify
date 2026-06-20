"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { findMascot } from "@/lib/mascots";
import { findLesson, LESSONS, lessonTrack } from "@/content/lessons";
import {
  computeStats,
  createRomajiState,
  evaluateLatinKeystroke,
  evaluateRomajiKeystroke,
  isLatinPhrase,
  targetForPhrase,
  type RomajiState,
} from "@/lib/typing/engine";
import { Keyboard } from "@/components/typing/Keyboard";
import {
  getProgress,
  getProfile,
  setProgress,
} from "@/lib/storage";
import { grantRewards, lessonXp } from "@/lib/rewards";
import type { ProgressState } from "@/types/localStorage";

import styles from "./lesson.module.css";

const UNLOCK_ACCURACY = 0.8;

interface LessonRunnerProps {
  lessonId: string;
}

export function LessonRunner({ lessonId }: LessonRunnerProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const lesson = useMemo(() => findLesson(lessonId), [lessonId]);
  const profile = useMemo(() => getProfile(), []);
  const culture = profile?.homeCulture ?? "id";

  const phrases = useMemo(() => {
    if (!lesson) return [];
    return lessonTrack(lesson, culture);
  }, [lesson, culture]);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrase = phrases[phraseIndex];
  const target = phrase ? targetForPhrase(phrase, culture) : "";

  const [cursor, setCursor] = useState(0);
  const [romajiState, setRomajiState] = useState<RomajiState>(() => createRomajiState());
  const [mistakeFlash, setMistakeFlash] = useState(false);
  const [mascotMood, setMascotMood] = useState<"rest" | "happy" | "oops">("rest");
  const [keypop, setKeypop] = useState(false);

  const totalKeystrokesRef = useRef(0);
  const correctKeystrokesRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keypopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mascot = profile ? findMascot(profile.mascot) : findMascot("cat");

  const advancePhrase = useCallback(() => {
    setMascotMood("happy");
    setTimeout(() => setMascotMood("rest"), 800);
    if (phraseIndex + 1 >= phrases.length) {
      // Finalise the lesson. Use refs for the up-to-date counters.
      const elapsed = startTimeRef.current
        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
        : 0;
      const stats = computeStats(
        totalKeystrokesRef.current,
        correctKeystrokesRef.current,
        elapsed,
      );

      const progress = getProgress();
      const completed = new Set(progress.completedLessonIds);
      completed.add(lessonId);
      const newUnlocked = new Set(progress.unlockedLessonIds);
      if (stats.accuracy >= UNLOCK_ACCURACY && !newUnlocked.has(lessonId)) {
        const nextId = findNextLessonId(lessonId);
        if (nextId) newUnlocked.add(nextId);
      }
      const nextProgress: ProgressState = {
        ...progress,
        completedLessonIds: Array.from(completed),
        unlockedLessonIds: Array.from(newUnlocked),
        bestLessonResults: {
          ...progress.bestLessonResults,
          [lessonId]: {
            lessonId,
            cultureId: culture,
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            timeSpentSec: elapsed,
            phrasesCompleted: phraseIndex + 1,
            phrasesTotal: phrases.length,
            completedAt: new Date().toISOString(),
          },
        },
      };
      setProgress(nextProgress);

      grantRewards({
        xp: lessonXp(stats.accuracy),
        questCode: "complete-lesson",
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("typify:progress-updated"));
      }

      router.push(
        `/lessons/${lessonId}/done?wpm=${stats.wpm}&accuracy=${Math.round(stats.accuracy * 100)}`,
      );
      return;
    }
    setPhraseIndex((i) => i + 1);
    setCursor(0);
    setRomajiState(createRomajiState());
  }, [culture, lessonId, phraseIndex, phrases.length, router]);

  const triggerMistake = useCallback(() => {
    setMistakeFlash(true);
    setMascotMood("oops");
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => {
      setMistakeFlash(false);
      setMascotMood("rest");
    }, 350);
  }, []);

  const triggerKeypop = useCallback(() => {
    setKeypop(true);
    if (keypopTimerRef.current) clearTimeout(keypopTimerRef.current);
    keypopTimerRef.current = setTimeout(() => setKeypop(false), 180);
  }, []);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (!phrase) return;
      const key = event.key;
      if (key === "Shift" || key === "Control" || key === "Alt" || key === "Meta") return;

      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      const useLatin = isLatinPhrase(phrase) || culture !== "ja";
      totalKeystrokesRef.current += 1;

      if (useLatin) {
        const result = evaluateLatinKeystroke(target, cursor, key);
        if (result.isCorrect) {
          correctKeystrokesRef.current += 1;
          triggerKeypop();
          const newCursor = cursor + result.matched;
          setCursor(newCursor);
          if (newCursor >= target.length) {
            advancePhrase();
          }
        } else {
          triggerMistake();
        }
      } else {
        const result = evaluateRomajiKeystroke(romajiState, key);
        if (result.isCorrect) {
          correctKeystrokesRef.current += 1;
          if (result.committedKana !== "") triggerKeypop();
          setRomajiState(result.state);
          if (result.committedKana !== "") {
            const newCursor = cursor + [...result.committedKana].length;
            setCursor(newCursor);
            if (newCursor >= [...target].length) {
              advancePhrase();
            }
          }
        } else {
          triggerMistake();
        }
      }
    },
    [advancePhrase, culture, cursor, phrase, romajiState, target, triggerKeypop, triggerMistake],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      if (keypopTimerRef.current) clearTimeout(keypopTimerRef.current);
    };
  }, []);

  if (!lesson || !phrase) {
    return (
      <main className={styles.shell}>
        <p>{t("lessons.locked")}</p>
      </main>
    );
  }

  const chars = [...target];
  const cursorChar = chars[cursor] ?? null;
  const isRomajiPending = culture === "ja" && romajiState.pending.length > 0;

  return (
    <main className={styles.shell}>
      <header className={styles.topBar}>
        <button
          type="button"
          className={styles.exitBtn}
          onClick={() => router.push("/lessons")}
          aria-label={t("common.back")}
        >
          ← {t("common.back")}
        </button>
        <div className={styles.progressStrip}>
          <span className={styles.progressCount}>
            {phraseIndex + 1}/{phrases.length}
          </span>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${(phraseIndex / phrases.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <section className={styles.stage}>
        <div
          className={styles.mascotWrap}
          data-mood={mascotMood}
          data-keypop={keypop ? "1" : "0"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mascot.file} alt={mascot.alt} width={100} height={100} />
        </div>

        <div
          className={[styles.phrase, mistakeFlash ? styles.phraseFlash : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {chars.map((ch, i) => (
            <span
              key={i}
              className={[
                styles.phraseChar,
                i < cursor ? styles.phraseCharDone : "",
                i === cursor ? styles.phraseCharCurrent : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
          {isRomajiPending && (
            <span className={styles.romajiPending}>{romajiState.pending}</span>
          )}
        </div>
      </section>

      <Keyboard
        nextKey={isRomajiPending ? null : cursorChar}
        shiftActive={/[A-Z?!"#$%&*()]/.test(cursorChar ?? "")}
        spaceHighlighted={cursorChar === " "}
      />
    </main>
  );
}

function findNextLessonId(currentId: string): string | null {
  const sorted = [...LESSONS].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((l) => l.id === currentId);
  if (idx === -1) return null;
  return sorted[idx + 1]?.id ?? null;
}