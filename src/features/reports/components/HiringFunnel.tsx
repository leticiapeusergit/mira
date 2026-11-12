import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Legend } from "@/components/ui/Legend";
import { FUNNEL, FUNNEL_HISTORY, FUNNEL_LEGEND, FUNNEL_MAX } from "../data";
import styles from "./HiringFunnel.module.css";

const BAR_AREA = 153; // px height of the tallest bar
const TICKS = [200, 150, 100, 50, 0];

export function HiringFunnel() {
  return (
    <Card as="article" className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Hiring Funnel</h3>
        <Legend items={FUNNEL_LEGEND} />
      </div>

      <div className={styles.chart}>
        <div className={styles.yAxis} aria-hidden>
          <span>Candidates</span>
          {TICKS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className={styles.plot}>
          <div className={styles.bars}>
            {FUNNEL.map((stage, i) => {
              const prev = FUNNEL[i - 1];
              const pct = prev ? ` (${Math.round((stage.value / prev.value) * 100)}%)` : "";
              const name = stage.label.replace("\n", " ");
              return (
                <div key={stage.label} className={styles.column}>
                  <HoverCard
                    className={styles.barHover}
                    align={i === 0 ? "start" : i === FUNNEL.length - 1 ? "end" : "center"}
                    label={`${name}: ${stage.value}`}
                    content={
                      <HistoryCard
                        label={`${name}:`}
                        value={`${stage.value}${pct}`}
                        trend={stage.trend}
                        {...FUNNEL_HISTORY}
                      />
                    }
                  >
                    <span
                      className={styles.bar}
                      style={{
                        height: Math.max(4, (stage.value / FUNNEL_MAX) * BAR_AREA),
                        background: stage.color,
                      }}
                    >
                      <span className={styles.tooltip}>{stage.value}</span>
                    </span>
                  </HoverCard>
                </div>
              );
            })}
          </div>
          <div className={styles.xAxis} aria-hidden>
            {FUNNEL.map((stage) => (
              <span key={stage.label}>{stage.label}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
