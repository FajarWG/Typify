"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { getCultureBank } from "@/content/cultures";
import { getProfile } from "@/lib/storage";

import styles from "./games-list.module.css";

interface GameEntry {
  id: string;
  emoji: string;
  titleKey: string;
  descKey: string;
  bg: string;
}

const GAMES: GameEntry[] = [
  {
    id: "falling-words",
    emoji: "🌧️",
    titleKey: "games.fallingWords",
    descKey: "games.fallingWords",
    bg: "color-mix(in oklch, var(--color-accent) 24%, var(--color-paper))",
  },
  {
    id: "word-match",
    emoji: "🧩",
    titleKey: "games.wordPictureMatch",
    descKey: "games.wordPictureMatch",
    bg: "color-mix(in oklch, var(--color-accent-2) 24%, var(--color-paper))",
  },
  {
    id: "speed-round",
    emoji: "⚡",
    titleKey: "games.speedRound",
    descKey: "games.speedRound",
    bg: "color-mix(in oklch, var(--color-accent-3) 22%, var(--color-paper))",
  },
];

export default function GamesListPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const profile = getProfile();
  const culture = profile?.homeCulture ?? "id";
  const bank = getCultureBank(culture);

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
        <span className="mono-label">{t("nav.games")}</span>
      </header>

      <section className={styles.cultureCard}>
        <span className={styles.flag} aria-hidden>
          {bank.flag}
        </span>
        <div>
          <span className={styles.cultureLabel}>{t("settings.culture")}</span>
          <p className={styles.cultureFact}>{bank.fact[profile?.uiLanguage ?? "en"]}</p>
        </div>
      </section>

      <h1 className={styles.title}>{t("nav.games")}</h1>

      <ul className={styles.list}>
        {GAMES.map((g) => (
          <li key={g.id} className={styles.item}>
            <Link href={`/games/${g.id}`} className={styles.card} style={{ background: g.bg }}>
              <span className={styles.cardEmoji} aria-hidden>
                {g.emoji}
              </span>
              <span className={styles.cardTitle}>{t(g.titleKey)}</span>
              <span className={styles.cardDesc}>{t(g.descKey)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}