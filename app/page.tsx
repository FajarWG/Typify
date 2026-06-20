"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { findMascot } from "@/lib/mascots";
import { getProfile } from "@/lib/storage";
import type { StudentProfile } from "@/types/localStorage";

import styles from "./home.module.css";

function subscribeProfile(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("typify:profile-updated", callback);
  return () => window.removeEventListener("typify:profile-updated", callback);
}

function getProfileSnapshot(): StudentProfile | null {
  return getProfile();
}

function getProfileServerSnapshot(): StudentProfile | null {
  return null;
}

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getProfileServerSnapshot,
  );

  if (profile === null) {
    if (typeof window !== "undefined") {
      router.replace("/onboarding");
    }
    return null;
  }

  if (!profile.onboardingCompleted) {
    if (typeof window !== "undefined") {
      router.replace("/onboarding");
    }
    return null;
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
      </section>
    </main>
  );
}