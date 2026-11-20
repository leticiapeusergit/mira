"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Legend } from "@/components/ui/Legend";
import type { ChartPoint } from "@/components/ui/LineChart";
import { VACANCIES } from "../data";
import { countAxis, trendFromSeries, type HistorySpec } from "../history";
import { monthSlices, windowRange } from "../period";
import { useReportsPeriod } from "../ReportsPeriodContext";
import { PeriodNote } from "./PeriodNote";
import styles from "./VacanciesCard.module.css";

const TICKS = [100, 75, 50, 25, 0];
const AXIS_MAX = TICKS[0];
/** Stacked bottom → top, as in the design. */
const STACK_ORDER = ["cancelled", "filled", "open"] as const;
/** Smallest segment (in axis units) that still fits its number inside. */
const MIN_LABELLED = 10;

const shortMonth = new Intl.DateTimeFormat("en-US", { month: "short" });

/**
 * One point per month of the selected period. The last month is `current`, the one before `previous`;
 * earlier months are mock values inside the spec's min–max range.
 */
function monthlySeries(months: { start: Date; end: Date }[], spec: HistorySpec): ChartPoint[] {
  const { current, previous, seed, min = current, max = current } = spec;
  const n = months.length;
  return months.map((m, i) => {
    const value =
      i === n - 1
        ? current
        : i === n - 2
          ? previous
          : Math.round(min + (max - min) * (0.5 + 0.5 * Math.sin(seed * 1.7 + i * 2.3)));
    return { label: shortMonth.format(m.start), detail: windowRange({ ...m, days: 0 }), value };
  });
}

export function VacanciesCard() {
  const { windows } = useReportsPeriod();
  // Columns are the months of the selected period.
  const selected = windows[windows.length - 1];
  const months = selected ? monthSlices(selected) : [];
  /** Series in focus (from the legend or a hovered segment): it shows its numbers, the rest dim. */
  const [focus, setFocus] = useState<string | null>(null);
  const segments = STACK_ORDER.map((key) => {
    const s = VACANCIES.find((v) => v.key === key)!;
    return { ...s, series: monthlySeries(months, s.history) };
  });
  const columns = months.map((_, i) => i);
  const last = months.length - 1;
  // Legend reads Filled · Cancelled · Open like the design.
  const legend = ["filled", "cancelled", "open"].map((k) => VACANCIES.find((v) => v.key === k)!);

  return (
    <Card as="article" className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Open Vacancies Vs Filled
          <PeriodNote />
        </h3>
        <Legend
          items={legend.map((s) => ({ key: s.key, label: s.label, color: s.color }))}
          active={focus}
          onActiveChange={setFocus}
        />
      </div>

      <div className={styles.chart} data-focus={focus ?? undefined}>
        <div className={styles.yAxis} aria-hidden>
          {TICKS.map((t) => (
            <span key={t} style={{ bottom: `${(t / AXIS_MAX) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>

        <div className={styles.columns}>
          {columns.map((w, c) => {
            const total = segments.reduce((sum, s) => sum + s.series[w].value, 0);
            return (
              <div key={w} className={styles.column} style={{ ["--i" as string]: c }}>
                <div className={styles.stack} style={{ height: `${(Math.min(total, AXIS_MAX) / AXIS_MAX) * 100}%` }}>
                  <span className={styles.total}>{total}</span>
                  {segments.map((s) => {
                    const value = s.series[w].value;
                    if (value <= 0) return null;
                    // Each segment's history runs up to this column's period.
                    const upTo = s.series.slice(0, w + 1);
                    return (
                      <HoverCard
                        key={s.key}
                        className={styles.segment}
                        style={{ flexGrow: value }}
                        label={`${s.label}, ${s.series[w].detail}: ${value}`}
                        content={
                          <HistoryCard
                            value={`${s.label}: ${value}`}
                            trend={trendFromSeries(upTo, { lowerIsBetter: s.history.lowerIsBetter })}
                            series={upTo}
                            axis={countAxis(upTo.map((p) => p.value))}
                          />
                        }
                      >
                        <span
                          className={styles.fill}
                          style={{ background: s.color }}
                          data-key={s.key}
                          data-focus={focus === s.key || undefined}
                          data-dim={(focus && focus !== s.key) || undefined}
                          onMouseEnter={() => setFocus(s.key)}
                          onMouseLeave={() => setFocus(null)}
                        >
                          {/* Too small to fit inside (e.g. cancelled): the number sits beside the column. */}
                          <span className={styles.segmentValue} data-outside={value < MIN_LABELLED || undefined}>
                            {value}
                          </span>
                        </span>
                      </HoverCard>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.xAxis} aria-hidden>
          {columns.map((w) => (
            <span key={w} data-current={w === last || undefined}>
              {segments[0].series[w].label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
