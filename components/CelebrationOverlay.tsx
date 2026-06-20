"use client";

import { useEffect, useState } from "react";

import styles from "./CelebrationOverlay.module.css";

/**
 * CelebrationOverlay
 * Mount once near the top of the app. Listens to `typify:rewards` and
 * emits a star-burst micro-celebration on every reward grant (Hum
 * signature move #7). The burst fades out in 420 ms and stacks if
 * multiple events arrive in quick succession.
 */
export function CelebrationOverlay() {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event: Event): void => {
      const detail = (event as CustomEvent).detail as { xpGained?: number } | undefined;
      const xp = detail?.xpGained ?? 0;
      if (xp <= 0) return;
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const x = 30 + Math.random() * 40;
      const y = 30 + Math.random() * 30;
      setBursts((b) => [...b, { id, x, y }]);
      window.setTimeout(() => {
        setBursts((b) => b.filter((burst) => burst.id !== id));
      }, 500);
    };
    window.addEventListener("typify:rewards", handler);
    return () => window.removeEventListener("typify:rewards", handler);
  }, []);

  if (bursts.length === 0) return null;
  return (
    <div className={styles.layer} aria-hidden>
      {bursts.map((b) => (
        <span
          key={b.id}
          className={styles.burst}
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
        />
      ))}
    </div>
  );
}