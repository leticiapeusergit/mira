"use client";

import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Tag } from "@/components/ui/Tag";
import { columnTarget, parseMetric, RECRUITER_COLUMNS, RECRUITER_ROWS, recruiterStatusHistory, type TargetStatus } from "../data";
import { countAxis, DAYS_AXIS, PERCENT_AXIS, periodSeries, trendFromSeries } from "../history";
import { monthSlices, windowRange } from "../period";
import { useReportsPeriod } from "../ReportsPeriodContext";
import styles from "./RecruitersTable.module.css";

/** `names` limits the rows (set by the group cards above); omit to show everyone. */
export function RecruitersTable({ names }: { names?: string[] }) {
  const { windows } = useReportsPeriod();
  const rows = names ? RECRUITER_ROWS.filter((r) => names.includes(r.name)) : RECRUITER_ROWS;
  // History column: the selected period month by month.
  const selected = windows[windows.length - 1];
  const months = selected ? monthSlices(selected) : [];

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
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={RECRUITER_COLUMNS.length + 2} className={styles.empty}>
                No recruiters in this group for the selected period.
              </td>
            </tr>
          )}
          {rows.map((row) => {
            // Seed from the full list so a row keeps its numbers when the table is filtered.
            const rowIndex = RECRUITER_ROWS.indexOf(row);
            return (
            <tr key={row.name} className={styles.row}>
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
                <StatusDots name={row.name} months={months} />
              </td>
            </tr>
            );
          })}
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

/** One dot per month of the selected period (oldest → latest); the last one is the current month. */
function StatusDots({ name, months }: { name: string; months: { start: Date; end: Date; label: string }[] }) {
  const history = recruiterStatusHistory(name, months.length);
  return (
    <ol className={styles.dots} data-dense={history.length > 7 || undefined} aria-label={`${name}: status by month in the selected period`}>
      {history.map((status, i) => {
        const m = months[i];
        const range = windowRange({ start: m.start, end: m.end, days: 0 });
        return (
          <li key={i} className={styles.dotItem}>
            <HoverCard
              compact
              label={`${range}: ${STATUS_LABEL[status]}`}
              content={
                <span className={styles.dotTooltip}>
                  <span className={styles.dot} data-status={status} />
                  {range}
                  <strong>{STATUS_LABEL[status]}</strong>
                </span>
              }
            >
              <span
                className={styles.dot}
                data-status={status}
                data-current={i === history.length - 1 || undefined}
              />
            </HoverCard>
          </li>
        );
      })}
    </ol>
  );
}
