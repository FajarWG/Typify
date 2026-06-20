"use client";

import { useTranslation } from "react-i18next";

import styles from "./onboarding.module.css";

interface StepNameProps {
  value: string;
  onChange: (name: string) => void;
}

export function StepName({ value, onChange }: StepNameProps) {
  const { t } = useTranslation();
  const trimmed = value.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 2;
  const tooLong = trimmed.length > 24;

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>{t("onboarding.namePrompt")}</h2>
      <label className={styles.fieldLabel} htmlFor="onb-name">
        <span className="sr-only">{t("onboarding.namePrompt")}</span>
      </label>
      <input
        id="onb-name"
        className={styles.nameInput}
        type="text"
        autoComplete="nickname"
        spellCheck={false}
        maxLength={24}
        placeholder={t("onboarding.namePlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={tooShort || tooLong}
      />
      <p className={styles.fieldHint} aria-live="polite">
        {trimmed.length}/24
        {tooShort ? ` · ${t("common.tryAgain")}` : ""}
        {tooLong ? ` · ${t("common.tryAgain")}` : ""}
      </p>
    </div>
  );
}