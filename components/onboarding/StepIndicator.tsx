"use client";

import styles from "./StepIndicator.module.css";

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <ol className={styles.list} aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <li
          key={n}
          className={[
            styles.dot,
            n < current ? styles.done : "",
            n === current ? styles.active : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-current={n === current ? "step" : undefined}
        />
      ))}
    </ol>
  );
}