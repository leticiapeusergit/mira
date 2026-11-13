"use client";

import { useId, useState } from "react";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { Card } from "@/components/ui/Card";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { HoverCard } from "@/components/ui/HoverCard";
import { Tag } from "@/components/ui/Tag";
import { Trend } from "@/components/ui/Trend";
import type { Recruiter, RecruiterGroup } from "../data";
import { countAxis, periodSeries } from "../history";
import { windowRange } from "../period";
import { useReportsPeriod } from "../ReportsPeriodContext";
import styles from "./RecruiterGroupCard.module.css";

/** How long the recruiter has been in this group, counted back from the selected period. */
function streakNote(streak: boolean[], group: RecruiterGroup["id"]): string {
  let run = 0;
  for (let i = streak.length - 1; i >= 0 && streak[i]; i--) run++;
  if (run <= 1) return "New this period";
  return group === "needs-review" ? `Flagged ${run} periods in a row` : `On target ${run} periods in a row`;
}

export function RecruiterGroupCard({ id, title, description, tone, maxAvatars, history, recruiters }: RecruiterGroup) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
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
          <Trend direction={delta >= 0 ? "up" : "down"}>{deltaText}</Trend>
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

        <button
          type="button"
          className={styles.toggle}
          data-open={open || undefined}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          onClick={() => setOpen((o) => !o)}
        >
          <img src="/assets/icons/expand-chevron.svg" alt="" width={16} height={16} />
        </button>
      </div>

      <div id={panelId} className={styles.panel} data-open={open || undefined}>
        <ul className={styles.people}>
          {recruiters.map((r) => (
            <RecruiterRowItem key={r.name} recruiter={r} group={id} windows={windows.map(windowRange)} />
          ))}
        </ul>
      </div>
    </Card>
  );
}

function RecruiterRowItem({
  recruiter,
  group,
  windows,
}: {
  recruiter: Recruiter;
  group: RecruiterGroup["id"];
  windows: string[];
}) {
  // Needs Review lists what was missed; Meeting All Targets lists the KPIs on target.
  const shown = recruiter.kpis.filter((k) => (group === "needs-review" ? !k.met : k.met));
  const inGroupLabel = group === "needs-review" ? "Needs review" : "Met all targets";

  return (
    <li className={styles.person}>
      <img className={styles.avatar} src={recruiter.avatar} alt="" width={28} height={28} />
      <div className={styles.personMain}>
        <div className={styles.personTop}>
          <span className={styles.name}>{recruiter.name}</span>
          <span className={styles.note}>{streakNote(recruiter.streak, group)}</span>
        </div>
        <div className={styles.tags}>
          {shown.map((k) => (
            <Tag key={k.label} tone={k.met ? "success" : "error"}>
              {k.label} {k.value}
            </Tag>
          ))}
        </div>
      </div>
      {/* One dot per period (oldest → current): filled when the recruiter was in this group. */}
      <ol className={styles.streak} aria-label={`${recruiter.name}: last ${recruiter.streak.length} periods`}>
        {recruiter.streak.map((inGroup, i) => (
          <li
            key={i}
            className={styles.streakDot}
            data-tone={group === "needs-review" ? "error" : "success"}
            data-on={inGroup || undefined}
            data-current={i === recruiter.streak.length - 1 || undefined}
            title={`${windows[i] ?? `Period ${i + 1}`} · ${inGroup ? inGroupLabel : "—"}`}
          />
        ))}
      </ol>
    </li>
  );
}
