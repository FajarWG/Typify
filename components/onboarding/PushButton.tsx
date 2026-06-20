"use client";

import { useTranslation } from "react-i18next";

import styles from "./PushButton.module.css";

type Variant = "primary" | "soft" | "outline";
type Size = "md" | "lg";

interface PushButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: Variant;
  size?: Size;
  tone?: "pear" | "cyan" | "coral" | "mint" | "lavender" | "ink";
  type?: "button" | "submit" | "reset";
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: styles.primary,
  soft: styles.soft,
  outline: styles.outline,
};

const SIZE_CLASS: Record<Size, string> = {
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

export function PushButton({
  children,
  variant = "primary",
  size = "md",
  tone = "pear",
  className,
  ...rest
}: PushButtonProps) {
  const { t } = useTranslation("common");
  const classes = [
    styles.btn,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    styles[`tone_${tone}` as const],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...rest} className={classes} aria-busy={rest["aria-busy"]}>
      <span className={styles.label}>{children ?? t("continue")}</span>
    </button>
  );
}