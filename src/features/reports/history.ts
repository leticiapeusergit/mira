import type { ChartPoint } from "@/components/ui/LineChart";
import { windowLabel, windowRange, type PeriodWindow } from "./period";

/**
 * What a metric needs for a period-over-period history:
 * its value in the selected period and in the period right before it.
 */
export type HistorySpec = {
  current: number;
  previous: number;
  /** Keeps each mock line distinct. */
  seed: number;
  /** Lower values are good (e.g. days to present); flips the trend colour. */
  lowerIsBetter?: boolean;
  /** Clamp for generated older periods (e.g. 0–100 for percentages). */
  min?: number;
  max?: number;
};

export type TrendInfo = { direction: "up" | "down"; text: string };

/**
 * One point per window, oldest first. The last two points are always `previous` and `current`,
 * so the headline value and the "vs previous period" delta match the chart.
 * Older periods are mock values until the reporting API exists.
 */
export function periodSeries(windows: PeriodWindow[], spec: HistorySpec): ChartPoint[] {
  const { current, previous, seed, min = 0, max = Number.POSITIVE_INFINITY } = spec;
  const n = windows.length;
  const days = windows[0]?.days ?? 90;
  const amplitude = Math.max(1, Math.abs(current - previous) * 1.5, Math.abs(current) * 0.08);

  return windows.map((w, i) => {
    let value: number;
    if (i === n - 1) value = current;
    else if (i === n - 2) value = previous;
    else {
      const wave = Math.sin(seed * 1.7 + i * 2.3 + days * 0.13) + Math.sin(seed * 0.9 + i * 1.1) * 0.5;
      value = Math.round(Math.min(max, Math.max(min, previous + wave * amplitude)));
    }
    return { label: windowLabel(w), detail: windowRange(w), value };
  });
}

/** Trend arrow + copy from the last two points, e.g. "+4% vs. prev". */
export function trendFromSeries(
  series: ChartPoint[],
  { unit = "", lowerIsBetter = false, mode = "delta" }: { unit?: string; lowerIsBetter?: boolean; mode?: "delta" | "percent" } = {},
): TrendInfo {
  const current = series.at(-1)?.value ?? 0;
  const previous = series.at(-2)?.value ?? current;
  const delta = current - previous;
  const good = lowerIsBetter ? delta <= 0 : delta >= 0;
  const amount =
    mode === "percent" ? `${previous ? Math.round((delta / previous) * 100) : 0}%` : `${Math.round(delta * 10) / 10}${unit}`;
  const sign = delta > 0 ? "+" : "";
  return { direction: good ? "up" : "down", text: `${sign}${amount} vs. prev` };
}

/** A y-axis that fits counts: top rounded up to 1/2/5 × 10ⁿ, ticks at top, half and zero. */
export function countAxis(values: number[]): { ticks: number[]; unit: string } {
  const peak = Math.max(1, ...values) * 1.2;
  const pow = 10 ** Math.floor(Math.log10(peak));
  const top = [1, 2, 5, 10].map((m) => m * pow).find((v) => v >= peak) ?? peak;
  return { ticks: [top, top / 2, 0], unit: "" };
}

export const PERCENT_AXIS = { ticks: [100, 75, 50, 25, 0], unit: "%" };
export const DAYS_AXIS = { ticks: [20, 15, 10, 5, 0], unit: "d" };
