import { formatRange, type Period } from "@/components/ui/PeriodPicker";

/** One comparable slice of time: the selected period, or one of the equally long periods before it. */
export type PeriodWindow = { start: Date; end: Date; days: number };

const PRESET_DAYS: Record<string, number> = {
  "Last 30 days": 30,
  "Last 90 days": 90,
  "Last 6 months": 182,
  "Last year": 365,
};

export const PERIOD_PRESETS = Object.keys(PRESET_DAYS);
export const DEFAULT_PERIOD: Period = { kind: "preset", label: "Last 90 days" };

/** How many periods each history shows (the current one is the last). */
export const HISTORY_LENGTH = 6;

const DAY_MS = 86_400_000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** The window the user selected, inclusive of both ends. */
export function currentWindow(period: Period, today = new Date()): PeriodWindow {
  if (period.kind === "custom") {
    const start = startOfDay(period.start);
    const end = startOfDay(period.end);
    return { start, end, days: Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1 };
  }
  const days = PRESET_DAYS[period.label] ?? 90;
  const end = startOfDay(today);
  return { start: addDays(end, -(days - 1)), end, days };
}

/** The selected window plus the `count - 1` back-to-back windows of the same length before it, oldest first. */
export function periodWindows(period: Period, count = HISTORY_LENGTH, today = new Date()): PeriodWindow[] {
  const current = currentWindow(period, today);
  return Array.from({ length: count }, (_, i) => {
    const shift = -current.days * (count - 1 - i);
    return { start: addDays(current.start, shift), end: addDays(current.end, shift), days: current.days };
  });
}

const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const month = new Intl.DateTimeFormat("en-US", { month: "short" });

/** Short x-axis label: each window is named by the day/month/year it ends in, depending on its length. */
export function windowLabel(w: PeriodWindow): string {
  if (w.days >= 330) return `${month.format(w.end)} '${String(w.end.getFullYear()).slice(2)}`;
  if (w.days > 45) return month.format(w.end);
  return monthDay.format(w.end);
}

export const windowRange = (w: PeriodWindow) => formatRange(w.start, w.end);
