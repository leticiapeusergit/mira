"use client";

import { useId, useState } from "react";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { Card } from "@/components/ui/Card";
import { Trend } from "@/components/ui/Trend";
import type { RecruiterGroup } from "../data";
import styles from "./RecruiterGroupCard.module.css";

export function RecruiterGroupCard({
  title,
  description,
  trend,
  tone,
  recruiters,
  maxAvatars,
  months,
  defaultOpen = false,
}: RecruiterGroup) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <Card as="article" className={styles.card}>
      <div className={styles.summary}>
        <div className={styles.text}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <Trend direction={trend.direction}>{trend.text}</Trend>
        </div>

        <div className={styles.badge} data-tone={tone}>
          <AvatarStack avatars={recruiters} max={maxAvatars} />
          <span className={styles.count}>{recruiters.length}</span>
        </div>

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
        <ul className={styles.months}>
          {months.map((m) => (
            <li key={m.month} className={styles.month}>
              <span className={styles.monthName}>{m.month}</span>
              <AvatarStack avatars={m.recruiters} size={20} />
              <span className={styles.monthCount} data-tone={tone}>
                {m.recruiters.length}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
