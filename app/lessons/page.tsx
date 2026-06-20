"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { LESSONS } from "@/content/lessons";
import { getProgress } from "@/lib/storage";

import styles from "./lessons.module.css";

function subscribeProgress(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("typify:progress-updated", callback);
  return () => window.removeEventListener("typify:progress-updated", callback);
}

function getProgressSnapshot() {
  return getProgress();
}

function getServerSnapshot() {
  return null;
}

export default function LessonsListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerSnapshot,
  );

  const unlocked = new Set(progress?.unlockedLessonIds ?? ["home-row"]);
  const completed = new Set(progress?.completedLessonIds ?? []);

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
        <span className="mono-label">{t("nav.lessons")}</span>
      </header>

      <h1 className={styles.title}>{t("nav.lessons")}</h1>
      <p className={styles.lead}>{t("lessons.accuracyThreshold")}</p>

      <ol className={styles.list}>
        {LESSONS.map((lesson) => {
          const isUnlocked = unlocked.has(lesson.id);
          const isDone = completed.has(lesson.id);
          return (
            <li key={lesson.id} className={styles.item}>
              {isUnlocked ? (
                <Link href={`/lessons/${lesson.id}`} className={styles.card}>
                  <span className={styles.cardOrder}>
                    {String(lesson.order).padStart(2, "0")}
                  </span>
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{t(lesson.titleKey)}</h2>
                    <p className={styles.cardDesc}>
                      {isDone ? t("lessons.complete") : t("lessons.unlocked")}
                    </p>
                  </div>
                  <span className={styles.cardStatus} data-status={isDone ? "done" : "open"}>
                    {isDone ? "✓" : "→"}
                  </span>
                </Link>
              ) : (
                <div className={[styles.card, styles.cardLocked].join(" ")} aria-disabled>
                  <span className={styles.cardOrder}>
                    {String(lesson.order).padStart(2, "0")}
                  </span>
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{t(lesson.titleKey)}</h2>
                    <p className={styles.cardDesc}>{t("lessons.locked")}</p>
                  </div>
                  <span className={styles.cardStatus} aria-hidden>
                    🔒
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </main>
  );
}