import { Card } from "@/components/ui/Card";
import { LOWEST_CONVERSION as c } from "../data";
import styles from "./StageConversion.module.css";

export function StageConversion() {
  const pct = Math.round((c.numerator / c.denominator) * 100);

  return (
    <Card as="article" className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.title}>Lowest Stage Conversion</h3>
        <div className={styles.donut}>
          <img src="/assets/icons/donut-track.svg" alt="" width={149.691} height={149.691} />
          <span className={styles.arc}>
            <img src="/assets/icons/donut-arc.svg" alt="" width={58.5842} height={32.8605} />
          </span>
          <span className={styles.value}>{pct}%</span>
        </div>
      </div>
      <p className={styles.caption}>
        {c.from} → {c.to}
        <br />
        <span className={styles.highlight}>
          {c.numerator} {c.numeratorLabel}
        </span>{" "}
        / {c.denominator} {c.denominatorLabel}
      </p>
    </Card>
  );
}
