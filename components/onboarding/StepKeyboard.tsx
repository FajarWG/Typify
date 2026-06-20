"use client";

import { useTranslation } from "react-i18next";

import type { KeyboardLayout } from "@/types/localStorage";

import styles from "./onboarding.module.css";

interface StepKeyboardProps {
  value: KeyboardLayout;
  onSelect: (kb: KeyboardLayout) => void;
}

const OPTIONS: { key: KeyboardLayout; keys: string[]; sample: string }[] = [
  { key: "qwerty", keys: ["Q W E R T Y", "A S D F G H J K L"], sample: "hello world" },
  { key: "romaji", keys: ["Q W E R T Y", "A S D F G H J K L"], sample: "konnichiwa" },
];

export function StepKeyboard({ value, onSelect }: StepKeyboardProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>{t("onboarding.keyboardPrompt")}</h2>
      <div className={styles.optionGrid} role="radiogroup" aria-label={t("onboarding.keyboardPrompt")}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={value === opt.key}
            className={[
              styles.optionCard,
              value === opt.key ? styles.optionCardActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelect(opt.key)}
          >
            <span className={styles.optionKey}>{t(`keyboard.${opt.key}`)}</span>
            <span className={styles.keyboardPreview}>
              {opt.keys.map((row, i) => (
                <span key={i} className={styles.keyRow}>{row}</span>
              ))}
            </span>
            <span className={styles.optionSample}>{opt.sample}</span>
          </button>
        ))}
      </div>
    </div>
  );
}