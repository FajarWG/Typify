"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { FallingWordsGame } from "@/components/games/FallingWordsGame";
import { WordMatchGame } from "@/components/games/WordMatchGame";
import { SpeedTest } from "@/components/games/SpeedTest";
import { setQuests, getQuests } from "@/lib/storage";
import { grantRewards } from "@/lib/rewards";
import { XP_AWARDS } from "@/lib/progression";
import type { QuestCode, QuestState } from "@/types/localStorage";

import styles from "./game.module.css";

interface GameFinish {
  accuracy: number;
  wpm?: number;
  correct?: number;
  total?: number;
}

function grantGameRewards(gameId: string, finish: GameFinish): void {
  const xp = Math.round((finish.accuracy ?? 0) * XP_AWARDS.miniGameComplete);
  grantRewards({
    xp,
    questCode: gameId === "speed-round" ? "speed-test" : "play-minigame",
  });
}

export default function GamePage() {
  const params = useParams<{ gameId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [done, setDone] = useState<GameFinish | null>(null);
  const [granted, setGranted] = useState<string | null>(null);

  useEffect(() => {
    // Mark "play-minigame" quest for today (idempotent)
    if (params.gameId === "falling-words" || params.gameId === "word-match") {
      const today = new Date().toISOString().slice(0, 10);
      const quests = getQuests();
      const alreadyDone = quests.completed.some(
        (q) => q.questCode === ("play-minigame" satisfies QuestCode) && q.localDate === today,
      );
      if (!alreadyDone) {
        const updatedQuests: QuestState = {
          ...quests,
          completed: [
            ...quests.completed,
            {
              questCode: "play-minigame" satisfies QuestCode,
              localDate: today,
              completedAt: new Date().toISOString(),
            },
          ],
        };
        setQuests(updatedQuests);
      }
    }
    if (params.gameId === "speed-round") {
      const today = new Date().toISOString().slice(0, 10);
      const quests = getQuests();
      const alreadyDone = quests.completed.some(
        (q) => q.questCode === ("speed-test" satisfies QuestCode) && q.localDate === today,
      );
      if (!alreadyDone) {
        const updatedQuests: QuestState = {
          ...quests,
          completed: [
            ...quests.completed,
            {
              questCode: "speed-test" satisfies QuestCode,
              localDate: today,
              completedAt: new Date().toISOString(),
            },
          ],
        };
        setQuests(updatedQuests);
      }
    }
  }, [params.gameId]);

  function handleFinish(finish: GameFinish): void {
    setDone(finish);
    const key = `${params.gameId}:${Date.now()}`;
    if (granted !== key) {
      grantGameRewards(params.gameId ?? "", finish);
      setGranted(key);
    }
  }

  if (!params.gameId) return null;

  const gameId = params.gameId;

  if (done) {
    return (
      <main className={styles.shell}>
        <section className={styles.card}>
          <span className="mono-label">{t("mascot.allDone")}</span>
          <h1 className={styles.title}>{t("mascot.newRecord")}</h1>
          <dl className={styles.stats}>
            {typeof done.wpm === "number" && (
              <div className={styles.statRow}>
                <dt className={styles.statLabel}>WPM</dt>
                <dd className={styles.statValue}>{done.wpm.toFixed(1)}</dd>
              </div>
            )}
            <div className={styles.statRow}>
              <dt className={styles.statLabel}>{t("lessons.accuracyThreshold").split(" ").slice(-1)[0] || "Acc"}</dt>
              <dd className={styles.statValue}>{Math.round(done.accuracy * 100)}%</dd>
            </div>
            {typeof done.correct === "number" && typeof done.total === "number" && (
              <div className={styles.statRow}>
                <dt className={styles.statLabel}>Score</dt>
                <dd className={styles.statValue}>{done.correct}/{done.total}</dd>
              </div>
            )}
          </dl>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cta}
              onClick={() => {
                setDone(null);
              }}
            >
              {t("common.tryAgain")}
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => router.push("/games")}
            >
              {t("nav.games")}
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (gameId === "falling-words") {
    return (
      <main className={styles.shell}>
        <button
          type="button"
          className={styles.exitBtn}
          onClick={() => router.push("/games")}
        >
          ← {t("common.back")}
        </button>
        <FallingWordsGame onFinish={handleFinish} />
      </main>
    );
  }
  if (gameId === "word-match") {
    return (
      <main className={styles.shell}>
        <button
          type="button"
          className={styles.exitBtn}
          onClick={() => router.push("/games")}
        >
          ← {t("common.back")}
        </button>
        <WordMatchGame onFinish={handleFinish} />
      </main>
    );
  }
  if (gameId === "speed-round") {
    return (
      <main className={styles.shell}>
        <button
          type="button"
          className={styles.exitBtn}
          onClick={() => router.push("/games")}
        >
          ← {t("common.back")}
        </button>
        <SpeedTest onFinish={handleFinish} />
      </main>
    );
  }
  return (
    <main className={styles.shell}>
      <p>{t("common.error")}</p>
    </main>
  );
}