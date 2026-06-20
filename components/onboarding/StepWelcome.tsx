"use client";

import { useTranslation } from "react-i18next";

import styles from "./onboarding.module.css";

interface StepWelcomeProps {
  onContinue: () => void;
}

export function StepWelcome({ onContinue }: StepWelcomeProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.welcomeWrap}>
      <div className={styles.mascotFloat} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mascots/cat.svg" alt="" width={120} height={120} />
      </div>
      <h1 className={styles.heroTitle}>
        {t("onboarding.welcome")}
      </h1>
      <p className={styles.heroLead}>
        {t("app.tagline")}
      </p>
      <button
        type="button"
        className={styles.bigContinue}
        onClick={onContinue}
      >
        {t("common.continue")}
      </button>
    </div>
  );
}