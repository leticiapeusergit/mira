"use client";

import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { TASK_AXIS, type TaskDurationChart as TaskDurationChartProps } from "../data";
import { periodSeries, trendFromSeries } from "../history";
import { useReportsPeriod } from "../ReportsPeriodContext";
import { PeriodNote } from "./PeriodNote";
import styles from "./TaskDurationChart.module.css";

const AXIS_MAX = TASK_AXIS[0];

/** Columns: business days per task in the selected period, value printed on top of each column. */
export function TaskDurationChart({ title, tasks }: TaskDurationChartProps) {
  const { windows } = useReportsPeriod();

  return (
    <Card as="article" className={styles.card}>
      <h3 className={styles.title}>
        {title}
        <PeriodNote />
      </h3>

      <div className={styles.chart}>
        <div className={styles.yAxis} aria-hidden>
          {TASK_AXIS.map((t) => (
            <span key={t} style={{ bottom: `${(t / AXIS_MAX) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>

        <div className={styles.columns}>
          {tasks.map((task, i) => {
            const days = task.history.current;
            const name = task.label.replace("\n", " ");
            const series = periodSeries(windows, task.history);
            return (
              <HoverCard
                key={task.key}
                className={styles.column}
                label={`${name}: ${days} business days`}
                content={
                  <HistoryCard
                    label={`${name}:`}
                    value={`${days} BD`}
                    trend={trendFromSeries(series, { unit: " BD", lowerIsBetter: true })}
                    series={series}
                    axis={{ ticks: [30, 15, 0], unit: "d" }}
                  />
                }
              >
                <span
                  className={styles.bar}
                  style={{
                    height: `${(Math.min(days, AXIS_MAX) / AXIS_MAX) * 100}%`,
                    background: task.color,
                    ["--i" as string]: i,
                  }}
                >
                  <span className={styles.value}>{days}</span>
                </span>
              </HoverCard>
            );
          })}
        </div>

        <div className={styles.xAxis} aria-hidden>
          {tasks.map((task) => (
            <span key={task.key}>{task.label}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}
