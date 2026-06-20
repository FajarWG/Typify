"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import {
  subscribe as subscribeProfile,
  getSnapshot as getProfileSnapshot,
  getServerSnapshot as getProfileServerSnapshot,
} from "@/lib/profileStore";

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

export default function QuestsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getProfileServerSnapshot,
  );
  // Bump counter every time quests mutate so the readTodayQuestCodes() call
  // below re-runs. useSyncExternalStore is overkill for this — we just need
  // a re-render trigger.
  const [, force] = useState(0);
  useEffect(() => {
    const handler = (): void => force((n) => n + 1);
    window.addEventListener("typify:quests-updated", handler);
    window.addEventListener("typify:rewards", handler);
    return () => {
      window.removeEventListener("typify:quests-updated", handler);
      window.removeEventListener("typify:rewards", handler);
    };
  }, []);

  useEffect(() => {
    if (!profile || !profile.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [profile, router]);

  if (!profile || !profile.onboardingCompleted) {
    return <main className={styles.shell} aria-hidden />;
  }

  // Derive today's completed quest codes from the live quests blob.
  const completedCodes = readTodayQuestCodes();

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

      <p className={styles.note}>{completedCodes.size} / 3 today</p>
    </main>
  );
}

function readTodayQuestCodes(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem("typify:quests");
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as {
      completed?: Array<{ questCode: string; localDate: string }>;
    };
    const today = new Date().toISOString().slice(0, 10);
    return new Set(
      (parsed.completed ?? [])
        .filter((q) => q.localDate === today)
        .map((q) => q.questCode),
    );
  } catch {
    return new Set();
  }
}