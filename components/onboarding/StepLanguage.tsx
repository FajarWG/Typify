"use client";

import { useTranslation } from "react-i18next";

import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n";
import { setUILanguage } from "@/components/I18nProvider";
import type { UILanguage } from "@/types/localStorage";

import styles from "./onboarding.module.css";

interface StepLanguageProps {
  value: UILanguage;
  onSelect: (lang: UILanguage) => void;
}

export function StepLanguage({ value, onSelect }: StepLanguageProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>{t("onboarding.languagePrompt")}</h2>
      <p className={styles.stepLead}>{t("onboarding.welcome")}</p>
      <div className={styles.optionGrid} role="radiogroup" aria-label={t("onboarding.languagePrompt")}>
        {SUPPORTED_LANGUAGES.map((lang: SupportedLanguage) => (
          <button
            key={lang}
            type="button"
            role="radio"
            aria-checked={value === lang}
            className={[
              styles.optionCard,
              value === lang ? styles.optionCardActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              onSelect(lang);
              setUILanguage(lang);
            }}
          >
            <span className={styles.optionKey}>{lang.toUpperCase()}</span>
            <span className={styles.optionLabel}>{LANGUAGE_LABELS[lang]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}