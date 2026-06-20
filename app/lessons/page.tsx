"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { LESSONS } from "@/content/lessons";
import {
  subscribe as subscribeProfile,
  getSnapshot as getProfileSnapshot,
  getServerSnapshot as getProfileServerSnapshot,
} from "@/lib/profileStore";
import {
  subscribe as subscribeProgress,
  getSnapshot as getProgressSnapshot,
  getServerSnapshot as getProgressServerSnapshot,
} from "@/lib/progressStore";

import styles from "./lessons.module.css";

export default function LessonsListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getProfileServerSnapshot,
  );
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );

  useEffect(() => {
    if (!profile || !profile.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [profile, router]);

  if (!profile || !profile.onboardingCompleted) {
    return <main className={styles.shell} aria-hidden />;
  }

  const unlocked = new Set(progress.unlockedLessonIds);
  const completed = new Set(progress.completedLessonIds);

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