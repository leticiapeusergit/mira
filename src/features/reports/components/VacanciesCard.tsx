"use client";

import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Legend } from "@/components/ui/Legend";
import { Trend } from "@/components/ui/Trend";
import { VACANCIES } from "../data";
import { countAxis, periodSeries, trendFromSeries } from "../history";
import { useReportsPeriod } from "../ReportsPeriodContext";
import styles from "./VacanciesCard.module.css";

export function VacanciesCard() {
  const { windows } = useReportsPeriod();
  const total = VACANCIES.reduce((sum, s) => sum + s.history.current, 0);
  const filled = VACANCIES.find((s) => s.key === "filled")!;
  const filledDelta = filled.history.current - filled.history.previous;

  return (
    <Card as="article" className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Open Vacancies Vs Filled</h3>
        <Legend items={VACANCIES.map((s) => ({ label: `${s.label}:${s.history.current}`, color: s.color }))} />
      </div>

      <div className={styles.bar}>
        {VACANCIES.map((s) => {
          const series = periodSeries(windows, s.history);
          return (
            <HoverCard
              key={s.key}
              className={styles.segment}
              style={{ flexGrow: s.history.current / total }}
              label={`${s.label}: ${s.history.current}`}
              content={
                <HistoryCard
                  value={`${s.label}: ${s.history.current}`}
                  trend={trendFromSeries(series, { lowerIsBetter: s.history.lowerIsBetter })}
                  series={series}
                  axis={countAxis(series.map((p) => p.value))}
                />
              }
            >
              <span className={styles.fill} style={{ background: s.color }} />
            </HoverCard>
          );
        })}
      </div>

      <Trend direction={filledDelta >= 0 ? "up" : "down"}>
        <span className={styles.positive}>
          {filledDelta >= 0 ? "+" : ""}
          {filledDelta} filled
        </span>{" "}
        <span className={styles.muted}>vs previous period</span>
      </Trend>
    </Card>
  );
}
