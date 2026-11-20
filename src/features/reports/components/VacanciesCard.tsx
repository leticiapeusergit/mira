"use client";

import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Legend } from "@/components/ui/Legend";
import { VACANCIES } from "../data";
import { countAxis, periodSeries, trendFromSeries } from "../history";
import { useReportsPeriod } from "../ReportsPeriodContext";
import styles from "./VacanciesCard.module.css";

const TICKS = [100, 75, 50, 25, 0];
const AXIS_MAX = TICKS[0];
/** Periods shown as columns: the selected one and the two before it. */
const COLUMNS = 3;
/** Stacked bottom → top, as in the design. */
const STACK_ORDER = ["cancelled", "filled", "open"] as const;
/** Smallest segment (in axis units) that still fits its number inside. */
const MIN_LABELLED = 12;

export function VacanciesCard() {
  const { windows } = useReportsPeriod();
  const segments = STACK_ORDER.map((key) => {
    const s = VACANCIES.find((v) => v.key === key)!;
    return { ...s, series: periodSeries(windows, s.history) };
  });
  const columns = windows.slice(-COLUMNS).map((_, c) => windows.length - COLUMNS + c);
  // Legend reads Filled · Cancelled · Open like the design.
  const legend = ["filled", "cancelled", "open"].map((k) => VACANCIES.find((v) => v.key === k)!);

  return (
    <Card as="article" className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Open Vacancies Vs Filled</h3>
        <Legend items={legend.map((s) => ({ label: s.label, color: s.color }))} />
      </div>

      <div className={styles.chart}>
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
                        <span className={styles.fill} style={{ background: s.color }} data-key={s.key}>
                          {value >= MIN_LABELLED && <span className={styles.segmentValue}>{value}</span>}
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
            <span key={w} data-current={w === windows.length - 1 || undefined}>
              {segments[0].series[w].label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
