import type { ChartPoint } from "@/components/ui/LineChart";
import { Card } from "@/components/ui/Card";
import { LineChart } from "@/components/ui/LineChart";
import { Trend } from "@/components/ui/Trend";
import type { Kpi } from "../data";
import { DAYS_AXIS, PERCENT_AXIS } from "../history";
import styles from "./KpiCard.module.css";

type KpiCardProps = Kpi & {
  /** Period-over-period series; the last point is the selected period. */
  series: ChartPoint[];
};

export function KpiCard({ title, target, unit, unitPlacement, tone, trend, history, targetValue, axis, series }: KpiCardProps) {
  const chartAxis = axis === "percent" ? PERCENT_AXIS : DAYS_AXIS;
  return (
    <Card as="article" padded={false} className={styles.card}>
      <div className={styles.top}>
        <div className={styles.heading}>
          <div className={styles.titles}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.target}>{target}</p>
          </div>
          <div className={styles.badge} data-tone={tone} data-unit={unitPlacement}>
            <span className={styles.value}>{history.current}</span>
            <span className={styles.unit}>{unit}</span>
          </div>
        </div>
        <Trend direction={trend.direction}>{trend.text}</Trend>
      </div>
      <LineChart
        data={series}
        target={targetValue}
        ticks={chartAxis.ticks}
        unit={chartAxis.unit}
        targetTone={tone === "error" ? "error" : "neutral"}
        ariaLabel={`${title.replace("\n", " ")} by period`}
      />
    </Card>
  );
}
