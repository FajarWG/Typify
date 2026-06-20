"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import {
  subscribe as subscribeProfile,
  getSnapshot as getProfileSnapshot,
} from "@/lib/profileStore";
import {
  subscribe as subscribeProgress,
  getSnapshot as getProgressSnapshot,
  getServerSnapshot as getProgressServerSnapshot,
} from "@/lib/progressStore";
import {
  subscribe as subscribeSettings,
  getSnapshot as getSettingsSnapshot,
  getServerSnapshot as getSettingsServerSnapshot,
} from "@/lib/settingsStore";

import styles from "./leaderboard.module.css";

interface Snapshot {
  settings: ReturnType<typeof getSettingsSnapshot>;
  progress: ReturnType<typeof getProgressSnapshot>;
  speed: {
    personalBest: { wpm: number; accuracy: number } | null;
  } | null;
  profileOnboarded: boolean;
}

function readSpeedBest(): Snapshot["speed"] {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("typify:speed-test");
    if (!raw) return null;
    return JSON.parse(raw) as Snapshot["speed"];
  } catch {
    return null;
  }
}

function buildSnapshot(): Snapshot {
  const profile = getProfileSnapshot();
  const settings = getSettingsSnapshot();
  const progress = getProgressSnapshot();
  return {
    settings,
    progress,
    speed: readSpeedBest(),
    profileOnboarded: profile?.onboardingCompleted === true,
  };
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (): void => callback();
  window.addEventListener("typify:speed-test-saved", handler);
  const a = subscribeProfile(handler);
  const b = subscribeSettings(handler);
  const c = subscribeProgress(handler);
  return () => {
    window.removeEventListener("typify:speed-test-saved", handler);
    a();
    b();
    c();
  };
}

function getServerSnapshot(): Snapshot {
  return {
    settings: getSettingsServerSnapshot(),
    progress: getProgressServerSnapshot(),
    speed: null,
    profileOnboarded: false,
  };
}

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const state = useSyncExternalStore(subscribe, buildSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!state.profileOnboarded) router.replace("/onboarding");
  }, [state.profileOnboarded, router]);

  if (!state.profileOnboarded) {
    return <main className={styles.shell} aria-hidden />;
  }

  const settings = state.settings;
  const progress = state.progress;
  const personalBest = state.speed?.personalBest ?? null;

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