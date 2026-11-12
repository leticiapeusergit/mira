import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Legend } from "@/components/ui/Legend";
import { Trend } from "@/components/ui/Trend";
import { VACANCIES } from "../data";
import styles from "./VacanciesCard.module.css";

export function VacanciesCard() {
  const { segments, trend } = VACANCIES;
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card as="article" className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Open Vacancies Vs Filled</h3>
        <Legend items={segments.map((s) => ({ label: `${s.label}:${s.value}`, color: s.color }))} />
      </div>

      <div className={styles.bar}>
        {segments.map((s) => (
          <HoverCard
            key={s.key}
            className={styles.segment}
            style={{ flexGrow: s.value / total }}
            label={`${s.label}: ${s.value}`}
            content={<HistoryCard {...s.history} />}
          >
            <span className={styles.fill} style={{ background: s.color }} />
          </HoverCard>
        ))}
      </div>

      <Trend direction="up">
        <span className={styles.positive}>{trend.value}</span>{" "}
        <span className={styles.muted}>{trend.text}</span>
      </Trend>
    </Card>
  );
}
