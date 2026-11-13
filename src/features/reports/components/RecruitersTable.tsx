"use client";

import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Tag } from "@/components/ui/Tag";
import { columnTarget, parseMetric, RECRUITER_COLUMNS, RECRUITER_ROWS } from "../data";
import { countAxis, DAYS_AXIS, PERCENT_AXIS, periodSeries, trendFromSeries } from "../history";
import { useReportsPeriod } from "../ReportsPeriodContext";
import styles from "./RecruitersTable.module.css";

export function RecruitersTable() {
  const { windows } = useReportsPeriod();

  return (
    <Card className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.nameCol}>
              Name
            </th>
            {RECRUITER_COLUMNS.map((col) => (
              <th key={col.key} scope="col" className={col.key === "present" ? styles.presentCol : undefined}>
                {col.label}
                {col.target && <span className={styles.target}>{col.target}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RECRUITER_ROWS.map((row, rowIndex) => (
            <tr key={row.name}>
              <th scope="row" className={styles.nameCol}>
                <span className={styles.person}>
                  <img src={row.avatar} alt="" width={32} height={32} className={styles.avatar} />
                  {row.name}
                </span>
              </th>
              {RECRUITER_COLUMNS.map((col, colIndex) => {
                const metric = row[col.key];
                const { amount, unit } = parseMetric(metric.value);
                const seed = 10 + rowIndex * 5 + colIndex;
                // Default previous: a small deterministic change so each cell has its own delta.
                const previous = metric.previous ?? amount - (((seed * 7) % 5) - 2) * (unit === "%" ? 2 : 1);
                const lowerIsBetter = unit === "d";
                const series = periodSeries(windows, {
                  current: amount,
                  previous,
                  seed,
                  lowerIsBetter,
                  min: 0,
                  max: unit === "%" ? 100 : unit === "d" ? 20 : undefined,
                });
                const axis = unit === "%" ? PERCENT_AXIS : unit === "d" ? DAYS_AXIS : countAxis(series.map((p) => p.value));
                const target = columnTarget(col.target, unit);
                const headline = `${col.label} ${metric.value}${metric.note ? ` ${metric.note}` : ""}`;
                return (
                  <td key={col.key}>
                    <HoverCard
                      className={styles.metric}
                      label={`${row.name} · ${headline}`}
                      content={
                        <HistoryCard
                          value={headline}
                          trend={trendFromSeries(series, { unit: unit === "d" ? " d" : unit, lowerIsBetter })}
                          series={series}
                          axis={axis}
                          target={target}
                          targetTone={metric.tone === "error" ? "error" : "neutral"}
                        />
                      }
                    >
                      <Tag tone={metric.tone}>{metric.value}</Tag>
                    </HoverCard>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
