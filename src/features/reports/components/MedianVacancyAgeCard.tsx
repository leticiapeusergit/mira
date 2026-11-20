"use client";

import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Trend } from "@/components/ui/Trend";
import { MEDIAN_VACANCY_AGE } from "../data";
import { periodSeries, trendFromSeries } from "../history";
import { useReportsPeriod } from "../ReportsPeriodContext";
import { PeriodNote } from "./PeriodNote";
import styles from "./MedianVacancyAgeCard.module.css";

export function MedianVacancyAgeCard() {
  const { windows } = useReportsPeriod();
  const { current, previous } = MEDIAN_VACANCY_AGE;
  const delta = current - previous;
  const series = periodSeries(windows, MEDIAN_VACANCY_AGE);

  return (
    <Card as="article" className={styles.card}>
      <h3 className={styles.title}>
        Median Vacancy Age
        <PeriodNote block />
      </h3>
      <HoverCard
        className={styles.hover}
        label={`Median vacancy age: ${current} days`}
        content={
          <HistoryCard
            value={`Median Vacancy Age: ${current} days`}
            trend={trendFromSeries(series, { unit: "d", lowerIsBetter: true })}
            series={series}
            axis={{ ticks: [60, 30, 0], unit: "d" }}
          />
        }
      >
        <span className={styles.badge}>
          <span className={styles.value}>{current}</span>
          <span className={styles.unit}>Days</span>
        </span>
      </HoverCard>
      {/* Selected period vs the equally long period before it; fewer days open is good news. */}
      <Trend direction={delta <= 0 ? "up" : "down"}>
        {delta > 0 ? "+" : ""}
        {delta} days vs previous period
      </Trend>
    </Card>
  );
}
