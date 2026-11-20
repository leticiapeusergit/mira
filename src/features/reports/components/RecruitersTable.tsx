"use client";

import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Tag } from "@/components/ui/Tag";
import { columnTarget, parseMetric, RECRUITER_COLUMNS, RECRUITER_ROWS, recruiterStatusHistory, type TargetStatus } from "../data";
import { countAxis, DAYS_AXIS, PERCENT_AXIS, periodSeries, trendFromSeries } from "../history";
import { windowRange, type PeriodWindow } from "../period";
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
            <th scope="col" className={styles.historyCol}>
              History
              <span className={styles.target}>{windows.length} × {windows[0]?.days ?? 0}d</span>
            </th>
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
              <td className={styles.historyCol}>
                <StatusDots name={row.name} windows={windows} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

const STATUS_LABEL: Record<TargetStatus, string> = {
  met: "Met all targets",
  review: "Needs review",
  partial: "Some targets met",
};

/** One dot per period of the selected length (oldest → selected); the last one is the selected period. */
function StatusDots({ name, windows }: { name: string; windows: PeriodWindow[] }) {
  const history = recruiterStatusHistory(name).slice(-windows.length);
  return (
    <ol className={styles.dots} aria-label={`${name}: status in the last ${history.length} periods`}>
      {history.map((status, i) => {
        const range = windows[windows.length - history.length + i];
        const label = `${range ? windowRange(range) : `Period ${i + 1}`}: ${STATUS_LABEL[status]}`;
        return (
          <li key={i} className={styles.dotItem}>
            <HoverCard
              compact
              label={label}
              content={
                <span className={styles.dotTooltip}>
                  <span className={styles.dot} data-status={status} />
                  {range ? windowRange(range) : `Period ${i + 1}`}
                  <strong>{STATUS_LABEL[status]}</strong>
                </span>
              }
            >
              <span className={styles.dot} data-status={status} data-current={i === history.length - 1 || undefined} />
            </HoverCard>
          </li>
        );
      })}
    </ol>
  );
}
