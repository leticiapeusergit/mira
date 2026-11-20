"use client";

import { AvatarStack } from "@/components/ui/AvatarStack";
import { Trend } from "@/components/ui/Trend";
import type { RecruiterGroup } from "../data";
import styles from "./RecruiterGroupCard.module.css";

type RecruiterGroupCardProps = RecruiterGroup & {
  active: boolean;
  /** Another group is selected: this one softens. */
  dimmed: boolean;
  onSelect: () => void;
};

/** Clickable group summary: toggles a filter on the recruiters table below. */
export function RecruiterGroupCard({
  id,
  title,
  description,
  tone,
  maxAvatars,
  history,
  recruiters,
  active,
  dimmed,
  onSelect,
}: RecruiterGroupCardProps) {
  const delta = history.current - history.previous;
  const deltaText = `${delta > 0 ? "+" : ""}${delta} vs previous period`;

  return (
    <button
      type="button"
      className={styles.card}
      aria-pressed={active}
      data-dimmed={dimmed || undefined}
      aria-label={`${title}: ${history.current} recruiters. ${active ? "Showing only them in the table; click to show all" : "Filter the table to them"}`}
      onClick={onSelect}
    >
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

        <span className={styles.badge} data-tone={tone}>
          <AvatarStack avatars={recruiters.map((r) => ({ src: r.avatar, name: r.name }))} max={maxAvatars} />
          <span className={styles.count}>{history.current}</span>
        </span>
      </div>
      <span className={styles.clear} aria-hidden>
        ×
      </span>
    </button>
  );
}

