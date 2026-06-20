"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import en from "@/i18n/locales/privacy-en.json";
import id from "@/i18n/locales/privacy-id.json";
import ja from "@/i18n/locales/privacy-ja.json";

import styles from "./privacy.module.css";

const PRIVACY: Record<"en" | "id" | "ja", typeof en> = { en, id, ja };

export default function PrivacyPage() {
  const { t, i18n } = useTranslation();
  const lang = (["en", "id", "ja"] as const).find((l) => l === i18n.language) ?? "en";
  const content = PRIVACY[lang];

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← {t("common.back")}
        </Link>
        <span className="mono-label">{content.title}</span>
      </header>

      <section className={styles.card}>
        <h1 className={styles.title}>{content.title}</h1>
        <p className={styles.lead}>{content.lead}</p>

        <div className={styles.sections}>
          {content.sections.map((s) => (
            <section key={s.h} className={styles.section}>
              <h2 className={styles.sectionTitle}>{s.h}</h2>
              <p className={styles.sectionBody}>{s.p}</p>
            </section>
          ))}
        </div>

        <p className={styles.langNote} aria-live="polite">
          {t("nav.language")}: <strong>{lang.toUpperCase()}</strong>
        </p>
      </section>
    </main>
  );
}