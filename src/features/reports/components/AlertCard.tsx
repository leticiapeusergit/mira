import { Card } from "@/components/ui/Card";
import type { Alert } from "../data";
import styles from "./AlertCard.module.css";

export function AlertCard({ tone, title, detail }: Alert) {
  return (
    <Card className={styles.alert}>
      <span className={styles.icon} data-tone={tone}>
        <img src={`/assets/icons/${tone === "error" ? "info" : "alert"}.svg`} alt="" width={18} height={18} />
      </span>
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        <p className={styles.detail}>{detail}</p>
      </div>
    </Card>
  );
}
