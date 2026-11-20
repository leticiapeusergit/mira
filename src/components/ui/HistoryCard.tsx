import { LineChart, type ChartPoint } from "./LineChart";
import { Trend } from "./Trend";
import styles from "./HistoryCard.module.css";

export type MetricHistory = {
  /** Plain label, rendered regular weight, e.g. "Passed Tech Assessment:". */
  label?: string;
  /** Emphasised value, e.g. "215 (68%)". */
  value: string;
  trend: { direction: "up" | "down"; text: string };
  series: ChartPoint[];
  target?: number;
  targetTone?: "neutral" | "error";
  /** Y-axis in the metric's own unit. */
  axis?: { ticks: number[]; unit: string };
};

/** Compact "value + trend + history chart" card shown inside hover popovers. */
export function HistoryCard({ label, value, trend, series, target, targetTone, axis }: MetricHistory) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <p className={styles.title}>
          {label && <span className={styles.label}>{label} </span>}
          {value}
        </p>
        <Trend direction={trend.direction} tone="strong">
          {trend.text}
        </Trend>
      </div>
      <LineChart
        data={series}
        target={target}
        targetTone={targetTone}
        ticks={axis?.ticks}
        unit={axis?.unit}
        size="sm"
        showValues
      />
    </div>
  );
}
