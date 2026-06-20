"use client";

import { useCallback, useMemo, useState } from "react";

import { findMascot } from "@/lib/mascots";
import { getCultureBank, translateWord, type CultureWord } from "@/content/cultures";
import { getProfile } from "@/lib/storage";
import type { CultureCode, UILanguage } from "@/types/localStorage";

import styles from "./word-match.module.css";

const TOTAL_ROUNDS = 8;

interface WordMatchGameProps {
  onFinish: (stats: { correct: number; total: number; accuracy: number }) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWords(culture: CultureCode, n: number): CultureWord[] {
  const bank = getCultureBank(culture);
  return shuffle(bank.words).slice(0, n);
}

export function WordMatchGame({ onFinish }: WordMatchGameProps) {
  const profile = useMemo(() => getProfile(), []);
  const culture = (profile?.homeCulture ?? "id") as CultureCode;
  const uiLang = (profile?.uiLanguage ?? "en") as UILanguage;
  const mascot = profile ? findMascot(profile.mascot) : findMascot("cat");

  const rounds = useMemo(() => pickWords(culture, TOTAL_ROUNDS), [culture]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mood, setMood] = useState<"rest" | "happy" | "oops">("rest");
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  const finish = useCallback(() => {
    onFinish({
      correct: correctCount,
      total: rounds.length,
      accuracy: rounds.length === 0 ? 0 : correctCount / rounds.length,
    });
  }, [correctCount, onFinish, rounds.length]);

  const handlePick = useCallback(
    (candidate: CultureWord, guessedId: string) => {
      const isCorrect = guessedId === candidate.id;
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        setFeedback("good");
        setMood("happy");
      } else {
        setFeedback("bad");
        setMood("oops");
      }
      setTimeout(() => {
        setFeedback(null);
        setMood("rest");
        const next = roundIndex + 1;
        if (next >= rounds.length) {
          finish();
          return;
        }
        setRoundIndex(next);
      }, 700);
    },
    [finish, roundIndex, rounds.length],
  );

  if (roundIndex >= rounds.length) {
    return null;
  }

  const target = rounds[roundIndex];
  // Build 3 options: the target + 2 random siblings from the bank (or 4 if bank has ≥ 5).
  const bank = getCultureBank(culture);
  const siblings = shuffle(bank.words.filter((w) => w.id !== target.id)).slice(0, 3);
  const options = shuffle([target, ...siblings]);

  return (
    <div className={styles.shell}>
      <div className={styles.hud}>
        <span className={styles.hudLabel}>Round</span>
        <span className={styles.hudValue}>
          {roundIndex + 1}/{rounds.length}
        </span>
      </div>

      <div className={styles.mascotWrap} data-mood={mood}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mascot.file} alt={mascot.alt} width={100} height={100} />
      </div>

      <div className={styles.prompt}>
        <span className={styles.emoji} aria-hidden>
          {target.emoji}
        </span>
        <span className={styles.word}>{target.display}</span>
      </div>

      <div className={styles.options} role="radiogroup" aria-label="Pick the meaning">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={false}
            className={[
              styles.option,
              feedback === "good" && opt.id === target.id ? styles.optionGood : "",
              feedback === "bad" && opt.id !== target.id && feedback !== null ? "" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => handlePick(target, opt.id)}
            disabled={feedback !== null}
          >
            <span className={styles.optionText}>{translateWord(opt, uiLang)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}