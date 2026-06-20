"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { getProgress, getSettings, getSpeedTest } from "@/lib/storage";

import styles from "./leaderboard.module.css";

export default function LeaderboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const settings = getSettings();
  const progress = getProgress();
  const speed = getSpeedTest();

  if (!settings.classroomOptIn) {
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
          <span className="mono-label">{t("nav.leaderboard")}</span>
        </header>
        <section className={styles.offCard}>
          <h1 className={styles.title}>{t("leaderboard.hidden")}</h1>
          <p className={styles.offLead}>{t("leaderboard.optIn")}</p>
          <Link href="/settings" className={styles.offLink}>
            {t("nav.settings")}
          </Link>
        </section>
      </main>
    );
  }

  const lessons = progress.completedLessonIds.length;
  const personalBest = speed.personalBest;

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
        <span className="mono-label">{t("nav.leaderboard")}</span>
      </header>

      <h1 className={styles.title}>{t("nav.leaderboard")}</h1>

      <section className={styles.localCard}>
        <span className="mono-label">Local</span>
        <ul className={styles.list}>
          <Row label={t("lessons.homeRow")} value={String(lessons)} sub={lessons >= 1 ? t("leaderboard.tierMaster") : t("leaderboard.tierPemula")} />
          <Row
            label="Best WPM"
            value={personalBest ? personalBest.wpm.toFixed(1) : "—"}
            sub={personalBest && personalBest.wpm >= 40 ? t("leaderboard.tierMaster") : t("leaderboard.tierPemula")}
          />
          <Row
            label="Best accuracy"
            value={personalBest ? `${Math.round(personalBest.accuracy * 100)}%` : "—"}
            sub={personalBest && personalBest.accuracy >= 0.95 ? t("leaderboard.tierAhli") : t("leaderboard.tierPemula")}
          />
        </ul>
        <p className={styles.globalNote}>
          {t("leaderboard.hidden").includes("off") ? "" : ""}
          Global leaderboard requires a connected classroom.
        </p>
      </section>
    </main>
  );
}

function Row({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <li className={styles.row}>
      <div>
        <span className={styles.rowLabel}>{label}</span>
        <span className={styles.rowSub}>{sub}</span>
      </div>
      <span className={styles.rowValue}>{value}</span>
    </li>
  );
}