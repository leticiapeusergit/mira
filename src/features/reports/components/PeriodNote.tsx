"use client";

import { windowRange } from "../period";
import { useReportsPeriod } from "../ReportsPeriodContext";
import styles from "./PeriodNote.module.css";

/** Subtle "(Last 90 days)" after a card title; shows the custom range when one is picked. */
export function PeriodNote({ block = false }: { block?: boolean }) {
  const { period, windows } = useReportsPeriod();
  const text = period.kind === "preset" ? period.label : windowRange(windows[windows.length - 1]);
  return (
    <span className={styles.note} data-block={block || undefined}>
      ({text})
    </span>
  );
}
