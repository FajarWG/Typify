"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { findMascot } from "@/lib/mascots";
import {
  computeStats,
  evaluateLatinKeystroke,
  targetForPhrase,
} from "@/lib/typing/engine";
import { findLesson } from "@/content/lessons";
import { getProfile } from "@/lib/storage";
import { Keyboard } from "@/components/typing/Keyboard";

import styles from "./falling-words.module.css";

const TOTAL_ROUNDS = 8;
const ROUND_DURATION_MS = 8000;

interface FallingWordsProps {
  onFinish: (stats: { wpm: number; accuracy: number; correct: number; total: number }) => void;
}

function pickPhrases(culture: "id" | "en" | "ja"): string[] {
  // Reuse lesson banks for cultural vocabulary. Mix the most-phrased
  // lessons so the kid sees varied words during the game.
  const lessons = ["home-row", "top-row", "bottom-row", "all-letters", "short-sentences"]
    .map((id) => findLesson(id))
    .filter((l): l is NonNullable<ReturnType<typeof findLesson>> => l !== undefined);
  const pool: string[] = [];
  for (const lesson of lessons) {
    const tracks = lesson.tracks[culture];
    for (const p of tracks) pool.push(targetForPhrase(p, culture));
  }
  // Shuffle (Fisher-Yates)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, TOTAL_ROUNDS);
}

export function FallingWordsGame({ onFinish }: FallingWordsProps) {
  const profile = useMemo(() => getProfile(), []);
  const culture = profile?.homeCulture ?? "id";
  const phrases = useMemo(() => pickPhrases(culture), [culture]);
  const mascot = profile ? findMascot(profile.mascot) : findMascot("cat");

  const [roundIndex, setRoundIndex] = useState(0);
  const [target, setTarget] = useState(phrases[0] ?? "");
  const [cursor, setCursor] = useState(0);
  const [roundProgress, setRoundProgress] = useState(0); // 0..1
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [mistakeFlash, setMistakeFlash] = useState(false);
  const [mood, setMood] = useState<"rest" | "happy" | "oops">("rest");

  const totalKeystrokesRef = useRef(0);
  const correctKeystrokesRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const roundStartRef = useRef<number | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    const elapsed = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 1;
    const stats = computeStats(totalKeystrokesRef.current, correctKeystrokesRef.current, elapsed);
    onFinish({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      correct: score,
      total: phrases.length,
    });
  }, [onFinish, phrases.length, score]);

  const advanceRound = useCallback(
    (correct: boolean) => {
      if (correct) {
        setScore((s) => s + 1);
        setMood("happy");
        setTimeout(() => setMood("rest"), 500);
      } else {
        setLives((l) => l - 1);
        setMood("oops");
        setTimeout(() => setMood("rest"), 500);
      }
      const next = roundIndex + 1;
      if (next >= phrases.length || lives - (correct ? 0 : 1) <= 0) {
        finish();
        return;
      }
      setRoundIndex(next);
      setTarget(phrases[next]);
      setCursor(0);
      setRoundProgress(0);
      roundStartRef.current = Date.now();
    },
    [finish, lives, phrases, roundIndex],
  );

  // Round progress animation (drift)
  useEffect(() => {
    if (roundStartRef.current === null) {
      roundStartRef.current = Date.now();
      startTimeRef.current = Date.now();
    }
    let raf = 0;
    const tick = (): void => {
      const elapsed = Date.now() - (roundStartRef.current ?? Date.now());
      const p = Math.min(1, elapsed / ROUND_DURATION_MS);
      setRoundProgress(p);
      if (p >= 1) {
        advanceRound(false);
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [advanceRound, roundIndex]);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;
      if (key === "Shift" || key === "Control" || key === "Alt" || key === "Meta") return;
      totalKeystrokesRef.current += 1;
      const result = evaluateLatinKeystroke(target, cursor, key);
      if (result.isCorrect) {
        correctKeystrokesRef.current += 1;
        const newCursor = cursor + 1;
        setCursor(newCursor);
        if (newCursor >= target.length) {
          advanceRound(true);
        }
      } else {
        setMistakeFlash(true);
        if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        flashTimerRef.current = setTimeout(() => setMistakeFlash(false), 250);
      }
    },
    [advanceRound, cursor, target],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const cursorChar = [...target][cursor] ?? null;

  return (
    <div className={styles.shell}>
      <div className={styles.hud}>
        <div className={styles.hudItem}>
          <span className={styles.hudLabel}>Lives</span>
          <span className={styles.hudValue}>{lives}</span>
        </div>
        <div className={styles.hudItem}>
          <span className={styles.hudLabel}>Score</span>
          <span className={styles.hudValue}>{score}/{phrases.length}</span>
        </div>
      </div>

      <div className={styles.stage}>
        <div className={styles.mascotWrap} data-mood={mood}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mascot.file} alt={mascot.alt} width={80} height={80} />
        </div>

        <div className={styles.wordArea}>
          <div
            className={styles.word}
            data-falling="true"
            style={{ top: `${roundProgress * 70}%`, background: mistakeFlash ? "color-mix(in oklch, var(--color-accent-3) 25%, var(--color-paper))" : undefined }}
          >
            {target.split("").map((ch, i) => (
              <span
                key={i}
                className={[
                  styles.char,
                  i < cursor ? styles.charDone : "",
                  i === cursor ? styles.charCurrent : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </div>
          <div className={styles.dangerLine} aria-hidden />
        </div>
      </div>

      <Keyboard nextKey={cursorChar} spaceHighlighted={cursorChar === " "} />
    </div>
  );
}