import { REAL_TIME_STATS } from "../data";
import styles from "./RealTimeStats.module.css";

/** Live counters at the top of Reports; these don't follow the period filter. */
export function RealTimeStats() {
  return (
    <ul className={styles.stats}>
      {REAL_TIME_STATS.map((stat, i) => (
        <li key={stat.label} className={styles.stat} style={{ ["--stagger" as string]: i }}>
          <span className={styles.label}>{stat.label}</span>
          <span className={styles.valueBox}>
            <span className={styles.value}>{stat.value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
