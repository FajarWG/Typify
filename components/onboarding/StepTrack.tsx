"use client";

import { useTranslation } from "react-i18next";

import type { OnboardingTrack } from "@/lib/onboarding/state";

import styles from "./onboarding.module.css";

interface StepTrackProps {
  value: OnboardingTrack | null;
  onSelect: (track: OnboardingTrack) => void;
}

export function StepTrack({ value, onSelect }: StepTrackProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>{t("onboarding.trackPrompt")}</h2>
      <div className={styles.optionGrid} role="radiogroup" aria-label={t("onboarding.trackPrompt")}>
        <button
          type="button"
          role="radio"
          aria-checked={value === "classroom"}
          className={[
            styles.optionCard,
            styles.optionCardWide,
            value === "classroom" ? styles.optionCardActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelect("classroom")}
        >
          <span className={styles.optionEmoji} aria-hidden>🏫</span>
          <span className={styles.optionLabel}>{t("onboarding.trackClassroom")}</span>
          <span className={styles.optionSample}>{t("onboarding.classCodePlaceholder")}</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={value === "independent"}
          className={[
            styles.optionCard,
            styles.optionCardWide,
            value === "independent" ? styles.optionCardActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelect("independent")}
        >
          <span className={styles.optionEmoji} aria-hidden>✨</span>
          <span className={styles.optionLabel}>{t("onboarding.trackIndependent")}</span>
          <span className={styles.optionSample}>{t("onboarding.warmupSkip")}</span>
        </button>
      </div>
    </div>
  );
}