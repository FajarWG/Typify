"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { findMascot } from "@/lib/mascots";
import { findLesson } from "@/content/lessons";
import { getProfile } from "@/lib/storage";

import styles from "./done.module.css";

export default function LessonDonePage() {
  return (
    <Suspense fallback={null}>
      <LessonDoneInner />
    </Suspense>
  );
}

function LessonDoneInner() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const lessonId = params.get("lessonId") ?? "";
  // We get the lessonId from the URL or fall back to the most recent
  const lesson = lessonId ? findLesson(lessonId) : null;
  const profile = getProfile();
  const mascot = profile ? findMascot(profile.mascot) : findMascot("cat");
  const wpm = Number(params.get("wpm") ?? 0);
  const accuracyPct = Number(params.get("accuracy") ?? 0);

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <div className={styles.mascotBurst}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mascot.file} alt={mascot.alt} width={140} height={140} />
        </div>
        <span className="mono-label">{lesson ? t(lesson.titleKey) : t("lessons.complete")}</span>
        <h1 className={styles.title}>{t("mascot.newRecord")}</h1>
        <dl className={styles.stats}>
          <div className={styles.statRow}>
            <dt className={styles.statLabel}>WPM</dt>
            <dd className={styles.statValue}>{wpm}</dd>
          </div>
          <div className={styles.statRow}>
            <dt className={styles.statLabel}>{t("lessons.accuracyThreshold").split(" ").slice(-1)[0] || "Accuracy"}</dt>
            <dd className={styles.statValue}>{accuracyPct}%</dd>
          </div>
        </dl>
        <div className={styles.actions}>
          <Link href="/lessons" className={styles.primaryLink}>
            {t("nav.lessons")}
          </Link>
          <Link href="/" className={styles.secondaryLink}>
            {t("nav.home")}
          </Link>
        </div>
      </section>
    </main>
  );
}