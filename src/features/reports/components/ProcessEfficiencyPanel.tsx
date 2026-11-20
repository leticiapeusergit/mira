import { PROCESS_EFFICIENCY } from "../data";
import { StageTimelineChart } from "./StageTimelineChart";
import { TaskDurationChart } from "./TaskDurationChart";
import styles from "./ProcessEfficiencyPanel.module.css";

/** Each row pairs a process timeline with the duration of the tasks inside it. */
export function ProcessEfficiencyPanel() {
  return (
    <section className={styles.panel} aria-labelledby="process-efficiency">
      <h2 id="process-efficiency" className={styles.title}>
        Process Efficiency
      </h2>
      {PROCESS_EFFICIENCY.map((row, i) => (
        <div key={row.timeline.title} className={styles.charts} style={{ ["--stagger" as string]: i * 2 }}>
          <StageTimelineChart {...row.timeline} />
          <TaskDurationChart {...row.tasks} />
        </div>
      ))}
    </section>
  );
}
