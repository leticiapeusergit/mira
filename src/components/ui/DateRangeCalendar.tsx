"use client";

import { useMemo, useState } from "react";
import styles from "./DateRangeCalendar.module.css";

export type DateRange = { start: Date; end: Date };

type DateRangeCalendarProps = {
  start: Date | null;
  end: Date | null;
  /** First click sets the start, second sets the end (swapped if earlier). A third click restarts. */
  onChange: (start: Date | null, end: Date | null) => void;
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && a.getTime() === b.getTime();

/** Six weeks starting on the Sunday on or before the 1st, so the grid height never changes. */
function monthGrid(view: Date) {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const gridStart = new Date(first);
  gridStart.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

export function DateRangeCalendar({ start, end, onChange }: DateRangeCalendarProps) {
  const [view, setView] = useState(() => {
    const anchor = end ?? start ?? new Date();
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  });
  /** Day under the pointer while picking the end, to preview the range. */
  const [hovered, setHovered] = useState<Date | null>(null);
  const days = useMemo(() => monthGrid(view), [view]);
  const today = startOfDay(new Date());

  const previewEnd = end ?? (start && hovered ? hovered : null);
  const [lo, hi] =
    start && previewEnd ? (start <= previewEnd ? [start, previewEnd] : [previewEnd, start]) : [start, start];

  const pick = (day: Date) => {
    if (!start || end) return onChange(day, null);
    return day < start ? onChange(day, start) : onChange(start, day);
  };

  const shiftMonth = (delta: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button type="button" className={styles.nav} onClick={() => shiftMonth(-1)} aria-label="Previous month">
          <img src="/assets/icons/select-chevron.svg" alt="" width={18} height={18} data-dir="prev" />
        </button>
        <span className={styles.month} aria-live="polite">
          {monthLabel.format(view)}
        </span>
        <button type="button" className={styles.nav} onClick={() => shiftMonth(1)} aria-label="Next month">
          <img src="/assets/icons/select-chevron.svg" alt="" width={18} height={18} data-dir="next" />
        </button>
      </div>

      <div className={styles.grid} role="grid" onMouseLeave={() => setHovered(null)}>
        {WEEKDAYS.map((w) => (
          <span key={w} className={styles.weekday} role="columnheader">
            {w}
          </span>
        ))}
        {days.map((day) => {
          const inRange = lo && hi && day >= lo && day <= hi;
          const isStart = sameDay(day, lo);
          const isEnd = sameDay(day, hi);
          return (
            <button
              key={day.toISOString()}
              type="button"
              role="gridcell"
              className={styles.day}
              data-outside={day.getMonth() !== view.getMonth() || undefined}
              data-today={sameDay(day, today) || undefined}
              data-in-range={(inRange && !isStart && !isEnd) || undefined}
              data-edge={isStart && isEnd ? "single" : isStart ? "start" : isEnd ? "end" : undefined}
              aria-pressed={isStart || isEnd}
              aria-label={day.toDateString()}
              onMouseEnter={() => setHovered(day)}
              onClick={() => pick(day)}
            >
              <span>{day.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
