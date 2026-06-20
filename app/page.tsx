"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { LESSONS } from "@/content/lessons";
import { getCultureBank, type CultureCode } from "@/content/cultures";
import { MASCOT_LIBRARY } from "@/lib/mascots";

import styles from "./landing.module.css";

const CULTURE_CODES: readonly CultureCode[] = ["id", "ja", "en"] as const;

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "id" | "ja") || "en";

  return (
    <>
      <nav className={styles.nav} aria-label={t("nav.home")}>
        <div className={styles.navPill}>
          <Link href="/" className={styles.navBrand} aria-label="Typify">
            <span className={styles.navBrandMark} aria-hidden />
            <span className={styles.navBrandWord}>Typify</span>
          </Link>
          <ul className={styles.navLinks}>
            <li>
              <a href="#cultures" className={styles.navLink}>
                {t("landing.cultures.eyebrow")}
              </a>
            </li>
            <li>
              <a href="#lessons" className={styles.navLink}>
                {t("landing.lessons.eyebrow")}
              </a>
            </li>
            <li>
              <Link href="/privacy" className={styles.navLink}>
                {t("landing.nav.privacy")}
              </Link>
            </li>
          </ul>
          <Link href="/home" className={styles.navCta}>
            {t("landing.nav.open")}
          </Link>
        </div>
      </nav>

      <main className={styles.shell}>
        {/* ----- Marquee Hero ----- */}
        <section className={styles.hero} aria-labelledby="hero-statement">
          <h1 id="hero-statement" className={styles.heroStatement}>
            <span className={styles.heroLine}>{t("landing.hero.line1")}</span>
            <span className={styles.heroLine}>
              <em className={styles.hl}>{t("landing.hero.line2")}</em>
            </span>
            <span className={styles.heroLine}>{t("landing.hero.line3")}</span>
          </h1>
        </section>

        <hr className={styles.rule} />

        {/* ----- Lead ----- */}
        <section className={styles.lead} id="cultures">
          <p className={styles.leadText}>{t("landing.lead")}</p>
        </section>

        {/* ----- Cultures ----- */}
        <section className={styles.section} aria-labelledby="cultures-title">
          <header className={styles.sectionHead}>
            <span className="mono-label">{t("landing.cultures.eyebrow")}</span>
            <h2 id="cultures-title" className={styles.sectionTitle}>
              {t("landing.cultures.title")}
            </h2>
          </header>
          <ul className={styles.cultureGrid}>
            {CULTURE_CODES.map((code) => {
              const bank = getCultureBank(code);
              const nameKey =
                code === "id"
                  ? t("landing.cultures.idName")
                  : code === "ja"
                    ? t("landing.cultures.jaName")
                    : t("landing.cultures.enName");
              const accent =
                code === "id"
                  ? "var(--color-accent)"
                  : code === "ja"
                    ? "var(--color-accent-3)"
                    : "var(--color-accent-2)";
              return (
                <li
                  key={code}
                  className={styles.cultureCard}
                  style={{ "--card-accent": accent } as CSSProperties}
                >
                  <span className={styles.cultureFlag} aria-hidden>
                    {bank.flag}
                  </span>
                  <h3 className={styles.cultureName}>{nameKey}</h3>
                  <p className={styles.cultureFact}>{bank.fact[lang]}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ----- Lessons ----- */}
        <section className={styles.section} id="lessons" aria-labelledby="lessons-title">
          <header className={styles.sectionHead}>
            <span className="mono-label">{t("landing.lessons.eyebrow")}</span>
            <h2 id="lessons-title" className={styles.sectionTitle}>
              {t("landing.lessons.title")}
            </h2>
          </header>
          <ol className={styles.lessonGrid}>
            {LESSONS.map((lesson, i) => {
              const accent =
                i % 3 === 0
                  ? "var(--color-accent)"
                  : i % 3 === 1
                    ? "var(--color-accent-2)"
                    : "var(--color-accent-3)";
              return (
                <li
                  key={lesson.id}
                  className={styles.lessonCard}
                  style={{ "--card-accent": accent } as CSSProperties}
                >
                  <span className={styles.lessonOrder}>
                    {String(lesson.order).padStart(2, "0")}
                  </span>
                  <span className={styles.lessonTitle}>
                    {t(lesson.titleKey)}
                  </span>
                  <span className={styles.lessonKeys}>
                    {lesson.keySet.length > 0
                      ? lesson.keySet.join(" ")
                      : "a → z"}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ----- Games ----- */}
        <section className={styles.section} aria-labelledby="games-title">
          <header className={styles.sectionHead}>
            <span className="mono-label">{t("landing.games.eyebrow")}</span>
            <h2 id="games-title" className={styles.sectionTitle}>
              {t("landing.games.title")}
            </h2>
          </header>
          <ul className={styles.gameGrid}>
            <li
              className={styles.gameCard}
              style={{ "--card-accent": "var(--color-accent)" } as CSSProperties}
            >
              <span className={styles.gameMark} aria-hidden>
                <span className={styles.gameMarkRain}>
                  <span />
                  <span />
                  <span />
                </span>
              </span>
              <h3 className={styles.gameTitle}>{t("games.fallingWords")}</h3>
              <p className={styles.gameDesc}>
                {t("landing.games.fallingWordsDesc")}
              </p>
            </li>
            <li
              className={styles.gameCard}
              style={{ "--card-accent": "var(--color-accent-2)" } as CSSProperties}
            >
              <span className={styles.gameMark} aria-hidden>
                <span className={styles.gameMarkMatch}>
                  <span className={styles.gameMarkMatchLeft} />
                  <span className={styles.gameMarkMatchArrow} />
                  <span className={styles.gameMarkMatchRight} />
                </span>
              </span>
              <h3 className={styles.gameTitle}>{t("games.wordPictureMatch")}</h3>
              <p className={styles.gameDesc}>
                {t("landing.games.wordPictureMatchDesc")}
              </p>
            </li>
            <li
              className={styles.gameCard}
              style={{ "--card-accent": "var(--color-accent-3)" } as CSSProperties}
            >
              <span className={styles.gameMark} aria-hidden>
                <span className={styles.gameMarkBolt} />
              </span>
              <h3 className={styles.gameTitle}>{t("games.speedRound")}</h3>
              <p className={styles.gameDesc}>
                {t("landing.games.speedRoundDesc")}
              </p>
            </li>
          </ul>
        </section>

        {/* ----- Speed test ----- */}
        <section className={styles.section} aria-labelledby="speed-title">
          <header className={styles.sectionHead}>
            <span className="mono-label">{t("landing.speed.eyebrow")}</span>
            <h2 id="speed-title" className={styles.sectionTitle}>
              {t("landing.speed.title")}
            </h2>
          </header>
          <div className={styles.speedCard}>
            <div className={styles.speedBody}>
              <p className={styles.speedDesc}>{t("landing.speed.desc")}</p>
              <p className={styles.privacyNote}>{t("landing.privacyNote")}</p>
            </div>
            <ul className={styles.tierStrip} aria-label="Leaderboard tiers">
              {(["tierPemula", "tierCepat", "tierAhli", "tierMaster"] as const).map(
                (k, i) => (
                  <li key={k} className={styles.tierChip}>
                    <span className={styles.tierMark} aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.tierLabel}>{t(`leaderboard.${k}`)}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </section>

        {/* ----- Daily quests ----- */}
        <section className={styles.section} aria-labelledby="quests-title">
          <header className={styles.sectionHead}>
            <span className="mono-label">{t("landing.quests.eyebrow")}</span>
            <h2 id="quests-title" className={styles.sectionTitle}>
              {t("landing.quests.title")}
            </h2>
          </header>
          <ul className={styles.questList}>
            <li
              className={styles.questCard}
              style={{ "--card-accent": "var(--color-accent)" } as CSSProperties}
            >
              <span className={styles.questCode}>01</span>
              <span className={styles.questTitle}>
                {t("quests.completeLesson")}
              </span>
            </li>
            <li
              className={styles.questCard}
              style={{ "--card-accent": "var(--color-accent-2)" } as CSSProperties}
            >
              <span className={styles.questCode}>02</span>
              <span className={styles.questTitle}>
                {t("quests.playMinigame")}
              </span>
            </li>
            <li
              className={styles.questCard}
              style={{ "--card-accent": "var(--color-accent-3)" } as CSSProperties}
            >
              <span className={styles.questCode}>03</span>
              <span className={styles.questTitle}>{t("quests.speedTest")}</span>
            </li>
          </ul>
        </section>

        {/* ----- Mascots ----- */}
        <section className={styles.section} aria-labelledby="mascots-title">
          <header className={styles.sectionHead}>
            <span className="mono-label">{t("landing.mascots.eyebrow")}</span>
            <h2 id="mascots-title" className={styles.sectionTitle}>
              {t("landing.mascots.title")}
            </h2>
          </header>
          <ul className={styles.mascotRow}>
            {MASCOT_LIBRARY.map((m) => (
              <li key={m.key} className={styles.mascotCell}>
                <span className={styles.mascotCircle} aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.file}
                    alt=""
                    width={56}
                    height={56}
                    className={styles.mascotImg}
                    loading="lazy"
                  />
                </span>
                <span className={styles.mascotName}>{m.name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ----- CTA ----- */}
        <section className={styles.ctaSection} aria-label={t("landing.cta")}>
          <Link href="/onboarding" className={styles.ctaButton}>
            <span className={styles.ctaText}>{t("landing.cta")}</span>
            <span className={styles.ctaArrow} aria-hidden>
              →
            </span>
          </Link>
        </section>

        {/* ----- Footer ----- */}
        <footer className={styles.footer}>
          <p className={styles.footerStatement}>
            {t("landing.footerStatement")}
          </p>
          <div className={styles.footerMeta}>
            <span className={styles.footerWordmark}>Typify</span>
            <Link href="/privacy" className={styles.footerLink}>
              {t("landing.nav.privacy")}
            </Link>
            <span className={styles.footerCopy}>
              © {new Date().getFullYear()}
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
