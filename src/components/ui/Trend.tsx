import styles from "./Trend.module.css";

type TrendProps = {
  direction: "up" | "down";
  children: React.ReactNode;
  /** "muted" = gray-600 text (stat cards), "strong" = gray-800 text (history cards). */
  tone?: "muted" | "strong";
  /** Whether the change is good news (teal) or bad news (red). Defaults to up = good. */
  sentiment?: "good" | "bad";
};

/** Trend arrow + comparison copy, e.g. "+2% than prev period". */
export function Trend({ direction, children, tone = "muted", sentiment }: TrendProps) {
  const good = (sentiment ?? (direction === "up" ? "good" : "bad")) === "good";
  return (
    <span className={styles.trend} data-tone={tone}>
      <span className={styles.icon} data-direction={direction} aria-hidden>
        <img src={`/assets/icons/trend-${good ? "up" : "down"}.svg`} alt="" width={16} height={9.5608} />
      </span>
      <span>{children}</span>
    </span>
  );
}
