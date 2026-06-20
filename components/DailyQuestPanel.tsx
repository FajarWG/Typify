"use client";

import type { CSSProperties } from "react";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import styles from "./DailyQuestPanel.module.css";

interface QuestDescriptor {
  code: "complete-lesson" | "play-minigame" | "speed-test";
  titleKey: string;
  href: string;
  emoji: string;
  /** CSS custom property name for this quest's accent. */
  accent: string;
  /** Deep variant for the press/edge shadow. */
  accentDeep: string;
}

const QUESTS: QuestDescriptor[] = [
  {
    code: "complete-lesson",
    titleKey: "quests.completeLesson",
    href: "/lessons",
    emoji: "🎹",
    accent: "--color-accent",
    accentDeep: "--color-accent-deep",
  },
  {
    code: "play-minigame",
    titleKey: "quests.playMinigame",
    href: "/games",
    emoji: "🎲",
    accent: "--color-accent-2",
    accentDeep: "--color-accent-2-deep",
  },
  {
    code: "speed-test",
    titleKey: "quests.speedTest",
    href: "/speed-test",
    emoji: "⚡",
    accent: "--color-accent-3",
    accentDeep: "--color-accent-3-deep",
  },
];

/**
 * DailyQuestPanel
 * Sticky right-side summary of today's three daily quests. Lives on the
 * home screen so progress stays in view while the kid taps into lessons,
 * games, or speed test. Uses the Hum multi-accent system: each quest
 * carries its own accent (pear / cyan / coral — the three colours Hum
 * puts on stage together), with colour-shift hover (signature #3) and a
 * small pear character mark that pulses at rest (signature #5). The
 * panel is the source of truth — there's no separate /quests page, the
 * list of quests is right here.
 */
export function DailyQuestPanel() {
  const { t } = useTranslation();
  const completed = useSyncExternalStore(
    subscribeQuestPanel,
    readTodayQuestSnapshot,
    getServerQuestSnapshot,
  );
  const done = completed.size;
  const total = QUESTS.length;
  const allDone = done === total;

  return (
    <aside className={styles.panel} aria-label={t("quests.title")}>
      <header className={styles.header}>
        <span className={styles.character} aria-hidden />
        <span className="mono-label">{t("quests.title")}</span>
        <span
          className={styles.count}
          aria-label={`${done} / ${total} ${t("quests.title")}`}
        >
          <span className={styles.countNum}>{done}</span>
          <span className={styles.countDivider}>/</span>
          <span className={styles.countTotal}>{total}</span>
        </span>
      </header>

      <ol className={styles.dots} aria-hidden>
        {QUESTS.map((q) => (
          <li
            key={q.code}
            className={styles.dot}
            data-done={completed.has(q.code) ? "1" : "0"}
            style={
              {
                "--dot-accent": `var(${q.accent})`,
              } as CSSProperties
            }
          />
        ))}
      </ol>

      <ul className={styles.list}>
        {QUESTS.map((q) => {
          const isDone = completed.has(q.code);
          return (
            <li
              key={q.code}
              className={[
                styles.item,
                isDone ? styles.itemDone : "",
                allDone ? styles.itemSatisfied : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={
                {
                  "--item-accent": `var(${q.accent})`,
                  "--item-accent-deep": `var(${q.accentDeep})`,
                } as CSSProperties
              }
            >
              <Link href={q.href} className={styles.itemLink}>
                <span
                  className={styles.itemFace}
                  aria-hidden
                  data-done={isDone ? "1" : "0"}
                >
                  <span className={styles.emoji}>{q.emoji}</span>
                </span>
                <span className={styles.itemBody}>
                  <span className={styles.itemTitle}>{t(q.titleKey)}</span>
                  <span className={styles.itemMeta}>
                    {isDone ? t("mascot.allDone") : t("quests.tapToStart")}
                  </span>
                </span>
                <span className={styles.itemStatus} aria-hidden>
                  {isDone ? "✓" : "→"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p
        className={styles.note}
        data-state={allDone ? "done" : "live"}
      >
        {allDone ? t("mascot.allDone") : t("quests.tapToStart")}
      </p>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// useSyncExternalStore plumbing
// ---------------------------------------------------------------------------
// Referentially-stable snapshot: a fresh Set on every render would loop
// forever (see the comment in lib/profileStore.ts). Cache the Set in
// module state and rebuild only when localStorage or the quest/reward
// events change.

const EMPTY: ReadonlySet<string> = new Set();

let cached: ReadonlySet<string> = EMPTY;
let lastSignature: string | null | undefined = undefined;

function signature(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("typify:quests");
  } catch {
    return null;
  }
}

function rebuild(): ReadonlySet<string> {
  const raw = signature();
  if (raw === lastSignature) return cached;
  lastSignature = raw;
  if (!raw) {
    cached = EMPTY;
    return cached;
  }
  try {
    const parsed = JSON.parse(raw) as {
      completed?: Array<{ questCode: string; localDate: string }>;
    };
    const today = new Date().toISOString().slice(0, 10);
    cached = new Set(
      (parsed.completed ?? [])
        .filter((q) => q.localDate === today)
        .map((q) => q.questCode),
    );
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function readTodayQuestSnapshot(): ReadonlySet<string> {
  return rebuild();
}

function getServerQuestSnapshot(): ReadonlySet<string> {
  return EMPTY;
}

function subscribeQuestPanel(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (): void => {
    // Invalidate cache so the next getSnapshot rebuilds from localStorage.
    lastSignature = undefined;
    callback();
  };
  window.addEventListener("typify:quests-updated", handler);
  window.addEventListener("typify:rewards", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("typify:quests-updated", handler);
    window.removeEventListener("typify:rewards", handler);
    window.removeEventListener("storage", handler);
  };
}
