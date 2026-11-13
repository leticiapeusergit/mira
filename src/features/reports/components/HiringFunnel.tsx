"use client";

import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Legend } from "@/components/ui/Legend";
import { FUNNEL, FUNNEL_LEGEND, FUNNEL_MAX } from "../data";
import { countAxis, periodSeries, trendFromSeries } from "../history";
import { useReportsPeriod } from "../ReportsPeriodContext";
import styles from "./HiringFunnel.module.css";

const BAR_AREA = 153; // px height of the tallest bar
const TICKS = [200, 150, 100, 50, 0];

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
          <span>Candidates</span>
          {TICKS.map((t) => (
            <span key={t}>{t}</span>
          ))}
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
                        height: Math.max(4, (value / FUNNEL_MAX) * BAR_AREA),
                        background: stage.color,
                      }}
                    >
                      <span className={styles.tooltip}>{value}</span>
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
