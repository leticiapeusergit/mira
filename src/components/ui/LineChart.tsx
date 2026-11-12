import styles from "./LineChart.module.css";

export type ChartPoint = { label: string; value: number };

type LineChartProps = {
  data: ChartPoint[];
  /** Dashed reference line (e.g. the KPI target). */
  target?: number;
  /** Top of the y-axis. Ticks are drawn at max, 2/3, 1/3 and 0. */
  max?: number;
  /** "md" for KPI cards, "sm" for the denser hover history cards. */
  size?: "sm" | "md";
  /** Colour of the target line. Defaults to gray; error is used when the target is missed. */
  targetTone?: "neutral" | "error";
  ariaLabel?: string;
};

const VIEW_W = 100;
const VIEW_H = 40;

export function LineChart({
  data,
  target,
  max = 150,
  size = "md",
  targetTone = "neutral",
  ariaLabel,
}: LineChartProps) {
  const ticks = [max, (max * 2) / 3, max / 3, 0].map((t) => Math.round(t));
  const step = data.length > 1 ? VIEW_W / (data.length - 1) : 0;
  const y = (v: number) => VIEW_H - (Math.min(Math.max(v, 0), max) / max) * VIEW_H;
  const points = data.map((d, i) => `${(i * step).toFixed(2)},${y(d.value).toFixed(2)}`).join(" ");

  return (
    <div className={styles.chart} data-size={size} role="img" aria-label={ariaLabel}>
      <div className={styles.yAxis} aria-hidden>
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className={styles.plotColumn}>
        <div className={styles.plot}>
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" className={styles.svg}>
            {target !== undefined && (
              <line
                x1={0}
                x2={VIEW_W}
                y1={y(target)}
                y2={y(target)}
                className={styles.target}
                data-tone={targetTone}
                vectorEffect="non-scaling-stroke"
              />
            )}
            <polyline points={points} className={styles.line} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className={styles.xAxis} aria-hidden>
          {data.map((d) => (
            <span key={d.label}>{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
