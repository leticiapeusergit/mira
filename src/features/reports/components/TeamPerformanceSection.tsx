"use client";

import { useEffect, useRef, useState } from "react";
import { ALERTS, KPIS, type KpiKey } from "../data";
import { periodSeries } from "../history";
import { useReportsPeriod } from "../ReportsPeriodContext";
import { AlertCard } from "./AlertCard";
import { HiringFunnel } from "./HiringFunnel";
import { KpiCard } from "./KpiCard";
import { MedianVacancyAgeCard } from "./MedianVacancyAgeCard";
import { VacanciesCard } from "./VacanciesCard";
import page from "../ReportsPage.module.css";
import styles from "./TeamPerformanceSection.module.css";

/**
 * Performance: clicking an alert focuses the KPI it refers to
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
    <section className={styles.section} aria-labelledby="performance">
      <h2 id="performance" className={page.sectionTitle}>
        Performance
      </h2>

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
        <HiringFunnel />
        <div className={styles.vacancies}>
          <VacanciesCard />
          <MedianVacancyAgeCard />
        </div>
      </div>
    </section>
  );
}
