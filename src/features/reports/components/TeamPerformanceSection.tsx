"use client";

import { useEffect, useRef, useState } from "react";
import { ALERTS, KPIS, type KpiKey } from "../data";
import { periodSeries } from "../history";
import { useReportsPeriod } from "../ReportsPeriodContext";
import { AlertCard } from "./AlertCard";
import { KpiCard } from "./KpiCard";
import { TeamFilters } from "./TeamFilters";
import { VacanciesCard } from "./VacanciesCard";
import page from "../ReportsPage.module.css";
import styles from "./TeamPerformanceSection.module.css";

/**
 * Team Performance: clicking an alert focuses the KPI it refers to
 * (highlights it, dims the rest, scrolls it into view). Click again or press Esc to clear.
 */
export function TeamPerformanceSection() {
  const [focused, setFocused] = useState<KpiKey | null>(null);
  const { windows } = useReportsPeriod();
  const slots = useRef(new Map<KpiKey, HTMLDivElement>());

  useEffect(() => {
    if (!focused) return;
    slots.current.get(focused)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFocused(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused]);

  return (
    <section className={page.section} aria-labelledby="team-performance">
      <div className={page.sectionHeader}>
        <h2 id="team-performance" className={page.sectionTitle}>
          Team Performance
        </h2>
        <TeamFilters />
      </div>

      <div className={page.row}>
        {ALERTS.map((alert) => (
          <AlertCard
            key={alert.title}
            tone={alert.tone}
            title={alert.title}
            detail={alert.detail}
            active={focused === alert.kpi}
            onSelect={() => setFocused((current) => (current === alert.kpi ? null : alert.kpi))}
          />
        ))}
      </div>

      <div className={page.row} data-filtering={focused ? "" : undefined}>
        {KPIS.map((kpi) => (
          <div
            key={kpi.id}
            ref={(el) => {
              if (el) slots.current.set(kpi.id, el);
              else slots.current.delete(kpi.id);
            }}
            className={styles.kpiSlot}
            data-state={focused ? (focused === kpi.id ? "focused" : "dimmed") : undefined}
          >
            <KpiCard {...kpi} series={periodSeries(windows, kpi.history)} />
          </div>
        ))}
      </div>

      <div className={styles.rest} data-dimmed={focused ? "" : undefined}>
        <VacanciesCard />
      </div>
    </section>
  );
}
