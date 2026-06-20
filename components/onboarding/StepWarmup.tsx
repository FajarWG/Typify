"use client";

import { useTranslation } from "react-i18next";

import styles from "./onboarding.module.css";

interface StepWarmupProps {
  onStart: () => void;
  onSkip: () => void;
}

export function StepWarmup({ onStart, onSkip }: StepWarmupProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>{t("onboarding.warmupPrompt")}</h2>
      <p className={styles.stepLead}>
        {t("speedTest.duration")}
      </p>
      <div className={styles.warmupActions}>
        <button
          type="button"
          className={styles.bigContinue}
          onClick={onStart}
        >
          {t("speedTest.start")}
        </button>
        <button
          type="button"
          className={styles.skipLink}
          onClick={onSkip}
        >
          {t("onboarding.warmupSkip")}
        </button>
      </div>
    </div>
  );
}