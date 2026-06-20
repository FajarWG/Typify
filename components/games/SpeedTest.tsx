"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { findMascot } from "@/lib/mascots";
import {
  computeStats,
  evaluateLatinKeystroke,
  targetForPhrase,
} from "@/lib/typing/engine";
import { findLesson, lessonTrack } from "@/content/lessons";
import { getProfile, setSpeedTest, getSpeedTest } from "@/lib/storage";
import { grantRewards } from "@/lib/rewards";
import { XP_AWARDS } from "@/lib/progression";
import { Keyboard } from "@/components/typing/Keyboard";
import type { SpeedTestResult } from "@/types/localStorage";

import styles from "./speed-test.module.css";

const TOTAL_DURATION_SEC = 30;

export interface SpeedTestSummary {
  wpm: number;
  accuracy: number;
  durationSec: number;
  personalBest: boolean;
  result: SpeedTestResult;
}

interface SpeedTestProps {
  onFinish?: (summary: SpeedTestSummary) => void;
  showHeader?: boolean;
  finishHref?: string;
}

export function SpeedTest({ onFinish, showHeader = true, finishHref }: SpeedTestProps) {
  const { t } = useTranslation();
  const profile = useMemo(() => getProfile(), []);
  const culture = (profile?.homeCulture ?? "id") as "id" | "en" | "ja";
  const mascot = profile ? findMascot(profile.mascot) : findMascot("cat");

  // Pull phrases from the most phrased lessons
  const source = useMemo(() => {
    const lessons = ["home-row", "top-row", "bottom-row", "all-letters", "short-sentences"]
      .map((id) => findLesson(id))
      .filter((l): l is NonNullable<ReturnType<typeof findLesson>> => l !== undefined);
    const pool: string[] = [];
    for (const l of lessons) {
      for (const p of lessonTrack(l, culture)) pool.push(targetForPhrase(p, culture));
    }
    return pool;
  }, [culture]);

  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [target, setTarget] = useState("");
  const [cursor, setCursor] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [mood, setMood] = useState<"rest" | "happy" | "oops">("rest");

  const totalKeystrokesRef = useRef(0);
  const correctKeystrokesRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const finishRef = useRef<typeof onFinish>(onFinish);
  const finishHrefRef = useRef<string | undefined>(finishHref);

  useEffect(() => {
    finishRef.current = onFinish;
    finishHrefRef.current = finishHref;
  });

  // Live counters (state) for the in-flight stats display. The refs above
  // remain the source of truth for the final computation — they get
  // mirrored into state on each keypress so we can read them during render.
  const [liveKeystrokes, setLiveKeystrokes] = useState(0);
  const [liveCorrect, setLiveCorrect] = useState(0);

  const pickNew = useCallback(() => {
    if (source.length === 0) return "";
    const next = source[Math.floor(Math.random() * source.length)] ?? "";
    setTarget(next);
    setCursor(0);
    return next;
  }, [source]);

  const stop = useCallback(() => {
    if (!startTimeRef.current) return;
    const finalElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const stats = computeStats(totalKeystrokesRef.current, correctKeystrokesRef.current, finalElapsed);
    const existing = getSpeedTest();
    const result: SpeedTestResult = {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      durationSec: finalElapsed,
      cultureId: culture,
      createdAt: new Date().toISOString(),
    };
    const personalBest = existing.personalBest === null || result.wpm > existing.personalBest.wpm;
    setSpeedTest({
      ...existing,
      personalBest: personalBest ? result : existing.personalBest,
      recent: [result, ...existing.recent].slice(0, 10),
    });
    grantRewards({
      xp: XP_AWARDS.speedTestComplete,
      questCode: "speed-test",
    });
    setFinished(true);
    setRunning(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("typify:speed-test-saved", { detail: result }));
    }
    if (finishHrefRef.current && typeof window !== "undefined") {
      const params = new URLSearchParams({
        wpm: String(result.wpm),
        accuracy: String(Math.round(result.accuracy * 100)),
        pb: personalBest ? "1" : "0",
      });
      window.location.href = `${finishHrefRef.current}?${params.toString()}`;
      return;
    }
    if (finishRef.current) {
      finishRef.current({ ...stats, durationSec: finalElapsed, personalBest, result });
    }
  }, [culture]);

  const start = useCallback(() => {
    setRunning(true);
    setFinished(false);
    totalKeystrokesRef.current = 0;
    correctKeystrokesRef.current = 0;
    startTimeRef.current = Date.now();
    pickNew();
  }, [pickNew]);

  // Tick elapsed + auto-stop at duration
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const e = startTimeRef.current
        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
        : 0;
      setElapsed(e);
      if (e >= TOTAL_DURATION_SEC) stop();
    }, 200);
    return () => window.clearInterval(id);
  }, [running, stop]);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (!running || finished) return;
      const key = event.key;
      if (key === "Shift" || key === "Control" || key === "Alt" || key === "Meta") return;
      totalKeystrokesRef.current += 1;
      correctKeystrokesRef.current += 1; // optimistic; corrected below if wrong
      setLiveKeystrokes(totalKeystrokesRef.current);
      setLiveCorrect(correctKeystrokesRef.current);
      const result = evaluateLatinKeystroke(target, cursor, key);
      if (result.isCorrect) {
        const newCursor = cursor + 1;
        if (newCursor >= target.length) {
          pickNew();
        } else {
          setCursor(newCursor);
        }
      } else {
        correctKeystrokesRef.current -= 1;
        setLiveCorrect(correctKeystrokesRef.current);
        setMood("oops");
        setTimeout(() => setMood("rest"), 200);
      }
    },
    [cursor, finished, pickNew, running, target],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const cursorChar = [...target][cursor] ?? null;
  const liveElapsed = elapsed;
  const liveStats = computeStats(liveKeystrokes, liveCorrect, Math.max(liveElapsed, 1));

  return (
    <div className={styles.shell}>
      {showHeader && (
        <header className={styles.header}>
          <span className="mono-label">{t("speedTest.title")}</span>
          <span className={styles.timer}>{TOTAL_DURATION_SEC - liveElapsed}s</span>
        </header>
      )}

      {!running && !finished && (
        <div className={styles.startScreen}>
          <div className={styles.mascotWrap} data-mood="rest">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mascot.file} alt={mascot.alt} width={120} height={120} />
          </div>
          <h2 className={styles.startTitle}>{t("speedTest.title")}</h2>
          <p className={styles.startLead}>{t("speedTest.duration")}</p>
          <button type="button" className={styles.startBtn} onClick={start}>
            {t("speedTest.start")}
          </button>
        </div>
      )}

      {running && (
        <>
          <div className={styles.statsRow}>
            <Stat label="WPM" value={liveStats.wpm.toFixed(1)} />
            <Stat label="ACC" value={`${Math.round(liveStats.accuracy * 100)}%`} />
            <Stat label={t("speedTest.duration").slice(0, 4)} value={`${TOTAL_DURATION_SEC - liveElapsed}s`} />
          </div>
          <div className={styles.stage}>
            <div className={styles.mascotWrapSmall} data-mood={mood}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mascot.file} alt={mascot.alt} width={64} height={64} />
            </div>
            <div className={styles.word}>
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
          </div>
          <Keyboard nextKey={cursorChar} spaceHighlighted={cursorChar === " "} />
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}