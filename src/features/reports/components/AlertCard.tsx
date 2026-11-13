import type { Alert } from "../data";
import styles from "./AlertCard.module.css";

type AlertCardProps = Omit<Alert, "kpi"> & {
  active: boolean;
  onSelect: () => void;
};

/** Clickable alert: toggles focus on the KPI card it refers to. */
export function AlertCard({ tone, title, detail, active, onSelect }: AlertCardProps) {
  return (
    <button type="button" className={styles.alert} data-tone={tone} aria-pressed={active} onClick={onSelect}>
      <span className={styles.icon} data-tone={tone}>
        <img src={`/assets/icons/${tone === "error" ? "info" : "alert"}.svg`} alt="" width={18} height={18} />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.detail}>{detail}</span>
      </span>
      <span className={styles.clear} aria-hidden>
        ×
      </span>
    </button>
  );
}
