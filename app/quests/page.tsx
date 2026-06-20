"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import {
  getProfile,
  getQuests,
  getProgress,
  getSpeedTest,
} from "@/lib/storage";

import styles from "./quests.module.css";

interface QuestDescriptor {
  code: "complete-lesson" | "play-minigame" | "speed-test";
  titleKey: string;
  href: string;
  emoji: string;
  bg: string;
}

const QUESTS: QuestDescriptor[] = [
  {
    code: "complete-lesson",
    titleKey: "quests.completeLesson",
    href: "/lessons",
    emoji: "🎹",
    bg: "color-mix(in oklch, var(--color-accent) 26%, var(--color-paper))",
  },
  {
    code: "play-minigame",
    titleKey: "quests.playMinigame",
    href: "/games",
    emoji: "🎲",
    bg: "color-mix(in oklch, var(--color-accent-2) 26%, var(--color-paper))",
  },
  {
    code: "speed-test",
    titleKey: "quests.speedTest",
    href: "/speed-test",
    emoji: "⚡",
    bg: "color-mix(in oklch, var(--color-accent-3) 26%, var(--color-paper))",
  },
];

function subscribeQuests(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("typify:rewards", callback);
  window.addEventListener("typify:progress-updated", callback);
  return () => {
    window.removeEventListener("typify:rewards", callback);
    window.removeEventListener("typify:progress-updated", callback);
  };
}

function snapshot() {
  return {
    quests: getQuests(),
    progress: getProgress(),
    speed: getSpeedTest(),
    profile: getProfile(),
  };
}

function serverSnapshot() {
  return null;
}

export default function QuestsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const state = useSyncExternalStore(subscribeQuests, snapshot, serverSnapshot);

  if (!state || !state.profile) {
    if (typeof window !== "undefined") router.replace("/onboarding");
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);
  const completedCodes = new Set(
    state.quests.completed
      .filter((q) => q.localDate === today)
      .map((q) => q.questCode),
  );

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => router.push("/")}
          aria-label={t("common.back")}
        >
          ← {t("common.back")}
        </button>
        <span className="mono-label">{t("quests.title")}</span>
      </header>

      <h1 className={styles.title}>{t("quests.title")}</h1>

      <ul className={styles.list}>
        {QUESTS.map((q) => {
          const done = completedCodes.has(q.code);
          return (
            <li key={q.code} className={styles.item}>
              <Link
                href={q.href}
                className={[styles.card, done ? styles.cardDone : ""].filter(Boolean).join(" ")}
                style={{ background: q.bg }}
              >
                <span className={styles.cardEmoji} aria-hidden>
                  {q.emoji}
                </span>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{t(q.titleKey)}</h2>
                  <p className={styles.cardMeta}>
                    {done ? t("mascot.allDone") : t("common.continue")}
                  </p>
                </div>
                <span className={styles.cardStatus}>{done ? "✓" : "→"}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className={styles.note}>
        {completedCodes.size} / 3 today
      </p>
    </main>
  );
}