"use client";

import { useTranslation } from "react-i18next";

import {
  MASCOT_LIBRARY,
} from "@/lib/mascots";
import {
  PRIMARY_COLOR_PALETTE,
  type PrimaryColorKey,
} from "@/lib/onboarding/state";
import type { MascotKey } from "@/types/localStorage";

import styles from "./onboarding.module.css";

interface StepMascotProps {
  mascot: MascotKey | null;
  primaryColor: PrimaryColorKey;
  onMascot: (m: MascotKey) => void;
  onColor: (c: PrimaryColorKey) => void;
}

export function StepMascot({ mascot, primaryColor, onMascot, onColor }: StepMascotProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>{t("onboarding.mascotPrompt")}</h2>
      <div
        className={styles.mascotGrid}
        role="radiogroup"
        aria-label={t("onboarding.mascotPrompt")}
      >
        {MASCOT_LIBRARY.map((m) => (
          <button
            key={m.key}
            type="button"
            role="radio"
            aria-checked={mascot === m.key}
            className={[
              styles.mascotTile,
              mascot === m.key ? styles.mascotTileActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onMascot(m.key)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.file} alt={m.alt} width={56} height={56} />
            <span className={styles.mascotTileName}>{m.name}</span>
          </button>
        ))}
      </div>
      <div className={styles.colorRow} role="radiogroup" aria-label="Primary colour">
        {PRIMARY_COLOR_PALETTE.map((c) => (
          <button
            key={c.key}
            type="button"
            role="radio"
            aria-checked={primaryColor === c.key}
            aria-label={c.key}
            className={[
              styles.colorDot,
              primaryColor === c.key ? styles.colorDotActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ background: c.value }}
            onClick={() => onColor(c.key)}
          />
        ))}
      </div>
    </div>
  );
}