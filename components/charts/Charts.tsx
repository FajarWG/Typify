"use client";

import { barsFromValues, lineChartPath } from "@/components/charts/svg";

interface WpmTrendChartProps {
  values: { date: string; wpm: number }[];
  width?: number;
  height?: number;
}

export function WpmTrendChart({ values, width = 320, height = 120 }: WpmTrendChartProps) {
  if (values.length === 0) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label="No data"
        style={{ display: "block" }}
      >
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          fill="var(--color-ink-3)"
          fontFamily="var(--font-mono)"
          fontSize="11"
        >
          No data yet
        </text>
      </svg>
    );
  }
  const path = lineChartPath(
    values.map((v) => ({ x: 0, y: v.wpm })),
    width,
    height,
  );
  const stepX = values.length > 1 ? (width - 16) / (values.length - 1) : 0;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="WPM trend">
      <path
        d={path}
        fill="none"
        stroke="var(--color-accent-2-deep)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const x = 8 + i * stepX;
        const y = (() => {
          const ys = values.map((p) => p.wpm);
          const maxY = Math.max(...ys, 1);
          const minY = Math.min(...ys, 0);
          const range = Math.max(maxY - minY, 1);
          return 8 + (height - 16) - ((v.wpm - minY) / range) * (height - 16);
        })();
        return <circle key={i} cx={x} cy={y} r={4} fill="var(--color-accent-2)" />;
      })}
    </svg>
  );
}

interface AccuracyBarsProps {
  values: { date: string; accuracy: number }[];
  width?: number;
  height?: number;
}

export function AccuracyBars({ values, width = 320, height = 120 }: AccuracyBarsProps) {
  if (values.length === 0) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label="No data"
        style={{ display: "block" }}
      >
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          fill="var(--color-ink-3)"
          fontFamily="var(--font-mono)"
          fontSize="11"
        >
          No data yet
        </text>
      </svg>
    );
  }
  const bars = barsFromValues(
    values.map((v) => v.accuracy * 100),
    100,
    width,
    height,
  );
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Accuracy per day">
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={2}
          fill="var(--color-accent)"
        />
      ))}
    </svg>
  );
}