"use client";

import { useEffect, useRef, useState } from "react";

interface TickUpProps {
  value: number;
  durationMs?: number;
  precision?: number;
  ariaLabel?: string;
  className?: string;
}

/**
 * TickUp
 * Counts from 0 → `value` over `durationMs`. Uses `requestAnimationFrame`
 * with a snappy ease-out. Honours `prefers-reduced-motion` by rendering
 * the final value instantly. Pulses once on completion (Hum signature #4).
 */
export function TickUp({ value, durationMs = 1200, precision = 1, ariaLabel, className }: TickUpProps) {
  const [display, setDisplay] = useState(value);
  const [pulse, setPulse] = useState(false);
  const rafRef = useRef<number>(0);
  const fromRef = useRef<number>(value);
  const toRef = useRef<number>(value);
  const startedRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    fromRef.current = display;
    toRef.current = value;
    startedRef.current = null;

    if (prefersReduced) {
      // Render the final value on the next frame so React still commits it
      // via a real state transition (rather than a synchronous setState in
      // the effect body, which the lint rule rejects).
      window.requestAnimationFrame(() => {
        setDisplay(value);
        setPulse(true);
        window.setTimeout(() => setPulse(false), 240);
      });
      return;
    }

    const tick = (timestamp: number): void => {
      if (startedRef.current === null) startedRef.current = timestamp;
      const elapsed = timestamp - startedRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = fromRef.current + (toRef.current - fromRef.current) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        setDisplay(toRef.current);
        setPulse(true);
        window.setTimeout(() => setPulse(false), 240);
      }
    };
    rafRef.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  const formatted = display.toFixed(precision);
  return (
    <span
      className={className}
      data-pulse={pulse ? "1" : "0"}
      aria-label={ariaLabel ?? formatted}
    >
      {formatted}
    </span>
  );
}