// Typify · hand-built SVG charts
// Tiny chart primitives. No chart library — Hum's tone says no.
// All charts take a fixed viewBox and a render-into-SVG-string approach
// to keep server-side rendering simple.

export interface Point {
  x: number;
  y: number;
}

export function lineChartPath(points: Point[], width: number, height: number, padding = 8): string {
  if (points.length === 0) return "";
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const maxY = Math.max(...points.map((p) => p.y), 1);
  const minY = Math.min(...points.map((p) => p.y), 0);
  const range = Math.max(maxY - minY, 1);
  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0;

  return points
    .map((p, i) => {
      const x = padding + i * stepX;
      const y = padding + innerH - ((p.y - minY) / range) * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function barsFromValues(
  values: number[],
  max: number,
  width: number,
  height: number,
  padding = 8,
): { x: number; y: number; w: number; h: number }[] {
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const maxV = Math.max(max, 1);
  if (values.length === 0) return [];
  const slot = innerW / values.length;
  const barW = Math.max(2, slot * 0.7);
  return values.map((v, i) => {
    const h = (v / maxV) * innerH;
    return {
      x: padding + i * slot + (slot - barW) / 2,
      y: padding + innerH - h,
      w: barW,
      h: Math.max(0, h),
    };
  });
}