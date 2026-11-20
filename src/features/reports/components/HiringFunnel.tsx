"use client";

import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Legend } from "@/components/ui/Legend";
import { FUNNEL, FUNNEL_LEGEND, FUNNEL_MAX, FUNNEL_TICKS } from "../data";
import { countAxis, periodSeries, trendFromSeries } from "../history";
import { useReportsPeriod } from "../ReportsPeriodContext";
import styles from "./HiringFunnel.module.css";

/** Bars and ticks share one scale so 200 sits exactly on the 200 tick. */
const SCALE_MAX = FUNNEL_MAX;

export function HiringFunnel() {
  const { windows } = useReportsPeriod();

  return (
    <Card as="article" className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Hiring Funnel</h3>
        <Legend items={FUNNEL_LEGEND} />
      </div>

      <div className={styles.chart}>
        <div className={styles.yAxis} aria-hidden>
          <span className={styles.yTitle}>Candidates</span>
          <div className={styles.ticks}>
            {FUNNEL_TICKS.map((t) => (
              <span key={t} style={{ bottom: `${(t / SCALE_MAX) * 100}%` }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.plot}>
          <div className={styles.bars}>
            {FUNNEL.map((stage, i) => {
              const value = stage.history.current;
              const prev = FUNNEL[i - 1];
              const pct = prev ? ` (${Math.round((value / prev.history.current) * 100)}%)` : "";
              const name = stage.label.replace("\n", " ");
              const series = periodSeries(windows, stage.history);
              return (
                <div key={stage.label} className={styles.column}>
                  <HoverCard
                    className={styles.barHover}
                    label={`${name}: ${value}`}
                    content={
                      <HistoryCard
                        label={`${name}:`}
                        value={`${value}${pct}`}
                        trend={trendFromSeries(series, { mode: "percent" })}
                        series={series}
                        axis={countAxis(series.map((p) => p.value))}
                      />
                    }
                  >
                    <span
                      className={styles.bar}
                      style={{
                        height: `max(10px, ${(value / SCALE_MAX) * 100}%)`,
                        background: stage.color,
                        ["--i" as string]: i,
                      }}
                    >
                      <span className={styles.value}>{value}</span>
                    </span>
                  </HoverCard>
                </div>
              );
            })}
          </div>
          <div className={styles.xAxis} aria-hidden>
            {FUNNEL.map((stage) => (
              <span key={stage.label}>{stage.label}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
