"use client";

import { AvatarStack } from "@/components/ui/AvatarStack";
import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Trend } from "@/components/ui/Trend";
import type { RecruiterGroup } from "../data";
import { countAxis, periodSeries } from "../history";
import { useReportsPeriod } from "../ReportsPeriodContext";
import styles from "./RecruiterGroupCard.module.css";

export function RecruiterGroupCard({ id, title, description, tone, maxAvatars, history, recruiters }: RecruiterGroup) {
  const { windows } = useReportsPeriod();
  const series = periodSeries(windows, history);
  const delta = history.current - history.previous;
  const deltaText = `${delta > 0 ? "+" : ""}${delta} vs previous period`;

  return (
    <Card as="article" className={styles.card}>
      <div className={styles.summary}>
        <div className={styles.text}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <Trend
            direction={delta >= 0 ? "up" : "down"}
            // More recruiters needing review is bad news; more meeting targets is good.
            sentiment={(id === "needs-review" ? delta <= 0 : delta >= 0) ? "good" : "bad"}
          >
            {deltaText}
          </Trend>
        </div>

        {/* Hover the badge for how the group size moved across periods. */}
        <HoverCard
          label={`${title}: ${history.current} recruiters`}
          content={
            <HistoryCard
              value={`${title}: ${history.current}`}
              trend={{ direction: delta >= 0 ? "up" : "down", text: `${delta > 0 ? "+" : ""}${delta} vs. prev` }}
              series={series}
              axis={countAxis(series.map((p) => p.value))}
            />
          }
        >
          <span className={styles.badge} data-tone={tone}>
            <AvatarStack
              avatars={recruiters.map((r) => ({ src: r.avatar, name: r.name }))}
              max={maxAvatars}
            />
            <span className={styles.count}>{history.current}</span>
          </span>
        </HoverCard>
      </div>
    </Card>
  );
}

