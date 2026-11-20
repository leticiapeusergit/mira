"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import { HoverCard } from "@/components/ui/HoverCard";
import { TIMELINE_MAX_DAYS, type StageTimeline, type TimelineStage } from "../data";
import { windowRange } from "../period";
import { useReportsPeriod } from "../ReportsPeriodContext";
import styles from "./StageTimelineChart.module.css";

const AXIS_TICKS = [0, 5, 10, 15, 20, 25, 30];

/** Mock days per stage for older periods; the selected period always uses `current`. */
function pastDays(current: number[], seed: number, periodIndex: number): number[] {
  const days = current.map((d, k) => Math.max(0.5, d * (1 + 0.3 * Math.sin(seed * 1.3 + periodIndex * 2.1 + k * 0.7))));
  const total = days.reduce((a, b) => a + b, 0);
  const fit = total > TIMELINE_MAX_DAYS - 0.5 ? (TIMELINE_MAX_DAYS - 0.5) / total : 1;
  return days.map((d) => Math.round(d * fit * 10) / 10);
}

const fmt = (d: number) => (Number.isInteger(d) ? `${d}` : d.toFixed(1));

/**
 * One stacked bar: business days per stage in the selected period.
 * The chevron expands the same breakdown for the periods before it.
 */
export function StageTimelineChart({ title, stages, current, seed }: StageTimeline) {
  const [open, setOpen] = useState(false);
  /** Stage highlighted from the legend or a hovered segment; the rest dim. */
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const historyId = useId();
  const { windows } = useReportsPeriod();
  const selectedRange = windows.length ? windowRange(windows[windows.length - 1]) : "Selected period";
  const past = windows.slice(0, -1).map((w, i) => ({ window: w, days: pastDays(current, seed, i) })).reverse();

  const bar = (days: number[], periodLabel: string, size: "lg" | "sm") => (
    <div className={styles.track} data-size={size}>
      {days.map((d, i) => {
        const stage = stages[i];
        if (!stage || d <= 0) return null;
        return (
          <Segment
            key={stage.key}
            stage={stage}
            days={d}
            prev={i > 0 ? days[i - 1] : undefined}
            periodLabel={periodLabel}
            dim={!!activeStage && activeStage !== stage.key}
            onHover={setActiveStage}
          />
        );
      })}
    </div>
  );

  return (
    <Card as="article" padded={false} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button
          type="button"
          className={styles.toggle}
          data-open={open || undefined}
          aria-expanded={open}
          aria-controls={historyId}
          aria-label={open ? `Hide previous periods for ${title}` : `Show previous periods for ${title}`}
          onClick={() => setOpen((o) => !o)}
        >
          <img src="/assets/icons/expand-chevron.svg" alt="" width={16} height={16} />
        </button>
      </div>

      <div className={styles.chart}>
        {/* Only labelled when expanded, so it reads as one row among the periods below. */}
        <span className={styles.rowLabel} data-current data-hidden={!open || undefined}>
          {selectedRange} · Selected period
        </span>
        {bar(current, selectedRange, "lg")}

        <div className={styles.axis} aria-hidden>
          {AXIS_TICKS.map((t) => (
            <span
              key={t}
              style={{ left: `${(t / TIMELINE_MAX_DAYS) * 100}%` }}
              data-edge={t === 0 ? "start" : t === TIMELINE_MAX_DAYS ? "end" : undefined}
            >
              {t} BD
            </span>
          ))}
        </div>

        {/* Previous periods of the same length as the selected one, newest first. Height animates via grid rows. */}
        <div id={historyId} className={styles.history} data-open={open || undefined}>
          <ul className={styles.rows}>
            {past.map(({ window, days }, i) => (
              <li key={i} className={styles.row} style={{ ["--row" as string]: i }}>
                <span className={styles.rowLabel}>{windowRange(window)}</span>
                {bar(days, windowRange(window), "sm")}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className={styles.legend} onMouseLeave={() => setActiveStage(null)}>
        {stages.map((stage) => (
          <li
            key={stage.key}
            className={styles.legendItem}
            data-dim={(activeStage && activeStage !== stage.key) || undefined}
            onMouseEnter={() => setActiveStage(stage.key)}
          >
            <span className={styles.swatch} style={{ background: stage.color }} aria-hidden />
            <span className={styles.legendLabel}>{stage.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Segment({
  stage,
  days,
  prev,
  periodLabel,
  dim,
  onHover,
}: {
  stage: TimelineStage;
  days: number;
  prev?: number;
  periodLabel: string;
  dim: boolean;
  onHover: (key: string | null) => void;
}) {
  const name = stage.label.replace("\n", " ");
  // Change in days vs the stage before it in the same period; the first stage has none.
  const change = prev ? Math.round(((days - prev) / prev) * 100) : null;
  return (
    <HoverCard
      compact
      className={styles.segment}
      // Subtract the 2px gap so a full 30 BD bar ends exactly at the 30 BD tick.
      style={{ width: `calc(${(days / TIMELINE_MAX_DAYS) * 100}% - 2px)` }}
      label={`${periodLabel} · ${name}: ${fmt(days)} business days`}
      content={
        <span className={styles.tooltip}>
          <span className={styles.tooltipSwatch} style={{ background: stage.color }} />
          {name}
          <strong>{fmt(days)} BD</strong>
          {change !== null && (
            <span className={styles.tooltipShare}>
              {change > 0 ? "+" : ""}
              {change}% from previous stage
            </span>
          )}
        </span>
      }
    >
      <span
        className={styles.fill}
        style={{ background: stage.color }}
        data-dim={dim || undefined}
        onMouseEnter={() => onHover(stage.key)}
        onMouseLeave={() => onHover(null)}
      />
    </HoverCard>
  );
}
