import { PROCESS_EFFICIENCY } from "../data";
import { StageTimelineChart } from "./StageTimelineChart";
import styles from "./ProcessEfficiencyPanel.module.css";

export function ProcessEfficiencyPanel() {
  return (
    <section className={styles.panel} aria-labelledby="process-efficiency">
      <h2 id="process-efficiency" className={styles.title}>
        Process Efficiency
      </h2>
      <div className={styles.charts}>
        {PROCESS_EFFICIENCY.map((timeline) => (
          <StageTimelineChart key={timeline.title} {...timeline} />
        ))}
      </div>
    </section>
  );
}
