"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { findMascot } from "@/lib/mascots";
import { ACCESSORIES, STICKERS } from "@/lib/progression";

import styles from "@/app/profile/profile.module.css";

interface ProfilePageProps {
  profile: {
    nickname: string;
    mascot: import("@/types/localStorage").MascotKey;
    primaryColor: string;
    level: number;
    xp: number;
    uiLanguage: import("@/types/localStorage").UILanguage;
    homeCulture: import("@/types/localStorage").CultureCode;
  };
  stats: {
    lessonsCompleted: number;
    speedBestWpm: number | null;
    speedBestAccuracy: number | null;
    culturesExplored: number;
  };
  unlocks: {
    accessories: string[];
    stickers: string[];
  };
}

export function ProfileView({ profile, stats, unlocks }: ProfilePageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const mascot = findMascot(profile.mascot);
  const equipped = ACCESSORIES.filter((a) => (unlocks.accessories as string[]).includes(a.key));
  const stickersTotal = STICKERS.length;
  const stickersCollected = unlocks.stickers.length;

  const ownedAccessoryKeys = new Set(unlocks.accessories);
  const ownedStickerKeys = new Set(unlocks.stickers);

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
        <span className="mono-label">{t("nav.profile")}</span>
      </header>

      <section className={styles.identityCard}>
        <div className={styles.mascotTile}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mascot.file} alt={mascot.alt} width={140} height={140} />
          {equipped.length > 0 && (
            <div className={styles.accessoryLayer}>
              {equipped.slice(0, 2).map((a) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={a.key} src={a.file} alt={a.name} width={48} height={48} />
              ))}
            </div>
          )}
        </div>
        <div className={styles.identityBody}>
          <h1 className={styles.nickname}>{profile.nickname}</h1>
          <span className={styles.mascotName}>{mascot.name}</span>
          <div className={styles.levelRow}>
            <span className={styles.levelBadge}>L{profile.level}</span>
            <div className={styles.xpTrack}>
              <div
                className={styles.xpFill}
                style={{ width: `${xpPercent(profile.xp)}%` }}
              />
            </div>
            <span className={styles.xpValue}>{profile.xp} XP</span>
          </div>
        </div>
      </section>

      <section className={styles.statsRow}>
        <Stat label={t("nav.lessons")} value={String(stats.lessonsCompleted)} />
        <Stat
          label="Best WPM"
          value={stats.speedBestWpm !== null ? stats.speedBestWpm.toFixed(1) : "—"}
        />
        <Stat
          label="Best acc"
          value={stats.speedBestAccuracy !== null ? `${Math.round(stats.speedBestAccuracy * 100)}%` : "—"}
        />
        <Stat
          label="Cultures"
          value={`${stats.culturesExplored}/3`}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Accessories</h2>
        <div className={styles.accessoryGrid}>
          {ACCESSORIES.map((a) => {
            const owned = ownedAccessoryKeys.has(a.key);
            return (
              <div key={a.key} className={[styles.accessoryTile, owned ? styles.accessoryOwned : styles.accessoryLocked].filter(Boolean).join(" ")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.file} alt={a.name} width={48} height={48} className={owned ? "" : styles.lockedImg} />
                <span className={styles.accessoryName}>{a.name}</span>
                <span className={styles.accessoryLevel}>L{a.unlockLevel}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Stickers <span className={styles.sectionCount}>{stickersCollected}/{stickersTotal}</span>
        </h2>
        <div className={styles.stickerGrid}>
          {STICKERS.map((s) => {
            const owned = ownedStickerKeys.has(s.key);
            return (
              <div key={s.key} className={[styles.stickerTile, owned ? styles.stickerOwned : styles.stickerLocked].filter(Boolean).join(" ")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.file} alt={s.name} width={56} height={56} className={owned ? "" : styles.lockedImg} />
                <span className={styles.stickerName}>{s.name}</span>
                <span className={styles.stickerCondition}>{s.condition}</span>
              </div>
            );
          })}
        </div>
      </section>

      <Link href="/" className={styles.altLink}>
        ← {t("nav.home")}
      </Link>
    </main>
  );
}

function xpPercent(xp: number): number {
  // Mirrors lib/progression: current xp in level / xp needed for next level
  const current = Math.floor(Math.sqrt(xp / 50)) + 1;
  const base = 50 * Math.pow(current - 1, 2);
  const next = 50 * Math.pow(current, 2);
  return Math.min(100, Math.max(0, ((xp - base) / (next - base)) * 100));
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}