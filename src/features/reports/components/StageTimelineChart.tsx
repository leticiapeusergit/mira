"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { HoverCard } from "@/components/ui/HoverCard";
import { TIMELINE_MAX_DAYS, type StageTimeline } from "../data";
import styles from "./StageTimelineChart.module.css";

const AXIS_TICKS = [0, 5, 10, 15, 20, 25, 30];

/** Horizontal stacked bars: business days spent in each stage, one row per month. */
export function StageTimelineChart({ title, stages, rows }: StageTimeline) {
  /** Stage highlighted from the legend or a hovered segment; the rest dim. */
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <Card as="article" className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.chart}>
        <ul className={styles.rows}>
          {rows.map((row, rowIndex) => {
            return (
              <li key={row.month} className={styles.row} style={{ ["--row" as string]: rowIndex }}>
                <span className={styles.month}>{row.month}</span>
                <div className={styles.track}>
                  {row.days.map((days, i) => {
                    const stage = stages[i];
                    if (!stage || days <= 0) return null;
                    const name = stage.label.replace("\n", " ");
                    // Change in days vs the stage before it in the same month; the first stage has none.
                    const prev = i > 0 ? row.days[i - 1] : undefined;
                    const change = prev ? Math.round(((days - prev) / prev) * 100) : null;
                    return (
                      <HoverCard
                        key={stage.key}
                        compact
                        className={styles.segment}
                        // Subtract the 2px gap so a full 30 BD row ends exactly at the 30 BD tick.
                        style={{ width: `calc(${(days / TIMELINE_MAX_DAYS) * 100}% - 2px)` }}
                        label={`${row.month} · ${name}: ${days} business days`}
                        content={
                          <span className={styles.tooltip}>
                            <span className={styles.tooltipSwatch} style={{ background: stage.color }} />
                            {name}
                            <strong>{days} BD</strong>
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
                          data-dim={(activeStage && activeStage !== stage.key) || undefined}
                          onMouseEnter={() => setActiveStage(stage.key)}
                          onMouseLeave={() => setActiveStage(null)}
                        />
                      </HoverCard>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>

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
