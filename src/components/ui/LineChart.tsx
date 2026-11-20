"use client";

import { useRef, useState } from "react";
import styles from "./LineChart.module.css";

/** `label` is the short x-axis text; `detail` (e.g. a full date range) shows in the tooltip. */
export type ChartPoint = { label: string; value: number; detail?: string };

type LineChartProps = {
  data: ChartPoint[];
  /** Dashed reference line (e.g. the KPI target). */
  target?: number;
  /** Top of the y-axis (defaults to the first tick). Ticks default to max, 2/3, 1/3 and 0. */
  max?: number;
  /** Explicit y-axis ticks, top to bottom (e.g. [100, 75, 50, 25, 0]). */
  ticks?: number[];
  /** Suffix for ticks and the value tooltip, e.g. "%" or "d". */
  unit?: string;
  /** "md" for KPI cards, "sm" for the denser hover history cards. */
  size?: "sm" | "md";
  /** Colour of the target line. Defaults to gray; error is used when the target is missed. */
  targetTone?: "neutral" | "error";
  /**
   * Point highlighted when the pointer isn't over the chart.
   * Charts inside hover popovers can't be hovered themselves, so they highlight the latest point.
   */
  restingIndex?: number;
  /** Print each point's value above it; replaces the hover marker and tooltip. */
  showValues?: boolean;
  ariaLabel?: string;
};

/** A point lower than the average of its neighbours; its value label goes under it. */
function isValley(data: ChartPoint[], i: number): boolean {
  const neighbours = [data[i - 1], data[i + 1]].filter(Boolean).map((p) => p.value);
  if (!neighbours.length) return false;
  return data[i].value < neighbours.reduce((a, b) => a + b, 0) / neighbours.length;
}

const UNIT_LABEL: Record<string, string> = { "%": "%", d: "Days" };

const VIEW_W = 100;
const VIEW_H = 40;

export function LineChart({
  data,
  target,
  max: maxProp,
  ticks: ticksProp,
  unit = "",
  size = "md",
  targetTone = "neutral",
  restingIndex,
  showValues = false,
  ariaLabel,
}: LineChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? restingIndex ?? null;
  /** Last shown point, kept so the marker fades out in place instead of vanishing. */
  const lastShown = useRef<number | null>(null);
  if (active !== null) lastShown.current = active;
  const markerIndex = active ?? lastShown.current;

  const max = maxProp ?? ticksProp?.[0] ?? 150;
  const ticks = ticksProp ?? [max, (max * 2) / 3, max / 3, 0].map((t) => Math.round(t));
  const last = data.length - 1;
  const n = Math.max(data.length, 1);
  // Points sit at the centre of each month column so they line up with the x-axis labels.
  const xPct = (i: number) => ((i + 0.5) / n) * 100;
  const yPct = (v: number) => 100 - (Math.min(Math.max(v, 0), max) / max) * 100;
  const points = data
    .map((d, i) => `${((xPct(i) / 100) * VIEW_W).toFixed(2)},${((yPct(d.value) / 100) * VIEW_H).toFixed(2)}`)
    .join(" ");

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setHovered(Math.min(n - 1, Math.max(0, Math.floor(ratio * n))));
  };

  const markerPoint = markerIndex !== null ? data[markerIndex] : null;

  return (
    <div className={styles.chart} data-size={size} role="img" aria-label={ariaLabel}>
      {/* The unit is named once above the axis instead of on every tick. */}
      <div className={styles.yAxis} aria-hidden>
        {unit && <span className={styles.unitLabel}>{UNIT_LABEL[unit] ?? unit}</span>}
        {ticks.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
      <div className={styles.plotColumn}>
        <div
          className={styles.plot}
          data-static={showValues || undefined}
          onMouseMove={showValues ? undefined : onMove}
          onMouseLeave={showValues ? undefined : () => setHovered(null)}
        >
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" className={styles.svg}>
            {target !== undefined && (
              <line
                x1={0}
                x2={VIEW_W}
                y1={(yPct(target) / 100) * VIEW_H}
                y2={(yPct(target) / 100) * VIEW_H}
                className={styles.target}
                data-tone={targetTone}
                vectorEffect="non-scaling-stroke"
              />
            )}
            <polyline points={points} className={styles.line} vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Resting dot on every period; the last one is the selected (current) period. */}
          {data.map((d, i) => (
            <span
              key={i}
              className={styles.point}
              data-active={i === active || undefined}
              data-current={i === last || undefined}
              style={{ left: `${xPct(i)}%`, top: `${yPct(d.value)}%`, ["--i" as string]: i }}
              aria-hidden
            />
          ))}

          {showValues &&
            data.map((d, i) => (
              <span
                key={`v${i}`}
                className={styles.pointValue}
                data-current={i === last || undefined}
                // Above peaks, below valleys, so the number never sits on the line.
                data-place={isValley(data, i) ? "below" : undefined}
                style={{ left: `${xPct(i)}%`, top: `${yPct(d.value)}%`, ["--i" as string]: i }}
                aria-hidden
              >
                {/* The unit is already on the y-axis; repeating it on every point is noise. */}
                {d.value}
              </span>
            ))}

          {/* Dot + tooltip are HTML so they stay round and crisp while the SVG stretches. */}
          {!showValues && markerPoint && markerIndex !== null && (
            <span
              className={styles.marker}
              data-visible={active !== null || undefined}
              style={{ left: `${xPct(markerIndex)}%`, top: `${yPct(markerPoint.value)}%` }}
              aria-hidden
            >
              <span className={styles.dot} />
              <span
                className={styles.tooltip}
                data-edge={markerIndex === 0 ? "start" : markerIndex === last ? "end" : undefined}
              >
                {markerPoint.detail && <span className={styles.tooltipDetail}>{markerPoint.detail}</span>}
                <span>
                  {markerPoint.value}
                  {unit}
                </span>
              </span>
            </span>
          )}
        </div>
        <div className={styles.xAxis} aria-hidden>
          {data.map((d, i) => (
            <span key={i} data-active={i === active || undefined} data-current={i === last || undefined}>
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
