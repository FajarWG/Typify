"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { findMascot } from "@/lib/mascots";
import {
  subscribe as subscribeProfile,
  getSnapshot as getProfileSnapshot,
  getServerSnapshot as getProfileServerSnapshot,
} from "@/lib/profileStore";

import styles from "./home.module.css";

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getProfileServerSnapshot,
  );

  const hydrated = profile !== null || typeof window === "undefined";

  useEffect(() => {
    if (!profile || !profile.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [profile, router]);

  if (!hydrated || !profile || !profile.onboardingCompleted) {
    return (
      <main className={styles.shell}>
        <div className={styles.hero} aria-hidden />
      </main>
    );
  }

  const mascot = findMascot(profile.mascot);

  return (
    <main className={styles.shell}>
      <header className={styles.hero}>
        <div className={styles.mascotCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mascot.file}
            alt={mascot.alt}
            width={140}
            height={140}
            className={styles.mascotImg}
          />
        </div>
        <div className={styles.heroText}>
          <span className="mono-label">{t("app.name")}</span>
          <h1 className={styles.heroTitle}>
            <em className={styles.hl}>Hi, {profile.nickname}!</em>
          </h1>
          <p className={styles.heroLead}>
            {mascot.name} {t("mascot.welcomeBack")}
          </p>
        </div>
      </header>

      <section className={styles.navGrid} aria-label={t("nav.home")}>
        <Link href="/lessons" className={styles.navCard} style={{ background: "color-mix(in oklch, var(--color-accent) 70%, var(--color-paper))" }}>
          <span className="mono-label">01</span>
          <span className={styles.navCardTitle}>{t("nav.lessons")}</span>
          <span className={styles.navCardDesc}>{t("lessons.homeRow")}</span>
        </Link>
        <Link href="/games" className={styles.navCard} style={{ background: "color-mix(in oklch, var(--color-accent-2) 30%, var(--color-paper))" }}>
          <span className="mono-label">02</span>
          <span className={styles.navCardTitle}>{t("nav.games")}</span>
          <span className={styles.navCardDesc}>{t("games.fallingWords")}</span>
        </Link>
        <Link href="/speed-test" className={styles.navCard} style={{ background: "color-mix(in oklch, var(--color-accent-3) 28%, var(--color-paper))" }}>
          <span className="mono-label">03</span>
          <span className={styles.navCardTitle}>{t("nav.speedTest")}</span>
          <span className={styles.navCardDesc}>{t("speedTest.duration")}</span>
        </Link>
        <Link href="/quests" className={styles.navCard} style={{ background: "color-mix(in oklch, var(--color-mint) 30%, var(--color-paper))" }}>
          <span className="mono-label">04</span>
          <span className={styles.navCardTitle}>{t("nav.quests")}</span>
          <span className={styles.navCardDesc}>{t("quests.completeLesson")}</span>
        </Link>
        <Link href="/leaderboard" className={styles.navCard} style={{ background: "color-mix(in oklch, var(--color-lavender) 26%, var(--color-paper))" }}>
          <span className="mono-label">05</span>
          <span className={styles.navCardTitle}>{t("nav.leaderboard")}</span>
          <span className={styles.navCardDesc}>{t("leaderboard.tierPemula")}</span>
        </Link>
        <Link href="/profile" className={styles.navCard} style={{ background: "color-mix(in oklch, var(--color-accent) 26%, var(--color-paper))" }}>
          <span className="mono-label">06</span>
          <span className={styles.navCardTitle}>{t("nav.profile")}</span>
          <span className={styles.navCardDesc}>{mascot.name}</span>
        </Link>
        <Link href="/settings" className={styles.navCard} style={{ background: "var(--color-paper-2)" }}>
          <span className="mono-label">07</span>
          <span className={styles.navCardTitle}>{t("nav.settings")}</span>
          <span className={styles.navCardDesc}>{t("settings.language")}</span>
        </Link>
      </section>
    </main>
  );
}