"use client";

import { useTranslation } from "react-i18next";

import styles from "./onboarding.module.css";

interface StepClassCodeProps {
  value: string;
  onChange: (code: string) => void;
}

export function StepClassCode({ value, onChange }: StepClassCodeProps) {
  const { t } = useTranslation();
  const normalised = value.toUpperCase().replace(/\s+/g, "");

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>{t("onboarding.classCodePrompt")}</h2>
      <p className={styles.stepLead}>{t("onboarding.classCodePlaceholder")}</p>
      <label className={styles.fieldLabel} htmlFor="onb-classcode">
        <span className="sr-only">{t("onboarding.classCodePrompt")}</span>
      </label>
      <input
        id="onb-classcode"
        className={styles.codeInput}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        placeholder={t("onboarding.classCodePlaceholder")}
        value={normalised}
        onChange={(e) => onChange(e.target.value)}
        maxLength={12}
        aria-describedby="onb-classcode-help"
      />
      <p id="onb-classcode-help" className={styles.fieldHint}>
        {t("lessons.accuracyThreshold")}
      </p>
    </div>
  );
}