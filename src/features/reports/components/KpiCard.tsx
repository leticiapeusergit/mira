import { Card } from "@/components/ui/Card";
import { LineChart } from "@/components/ui/LineChart";
import { Trend } from "@/components/ui/Trend";
import type { Kpi } from "../data";
import styles from "./KpiCard.module.css";

export function KpiCard({ title, target, value, unit, unitPlacement, tone, trend, series, targetValue }: Kpi) {
  return (
    <Card as="article" padded={false} className={styles.card}>
      <div className={styles.top}>
        <div className={styles.heading}>
          <div className={styles.titles}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.target}>{target}</p>
          </div>
          <div className={styles.badge} data-tone={tone} data-unit={unitPlacement}>
            <span className={styles.value}>{value}</span>
            <span className={styles.unit}>{unit}</span>
          </div>
        </div>
        <Trend direction={trend.direction}>{trend.text}</Trend>
      </div>
      <LineChart data={series} target={targetValue} ariaLabel={`${title.replace("\n", " ")} history`} />
    </Card>
  );
}
