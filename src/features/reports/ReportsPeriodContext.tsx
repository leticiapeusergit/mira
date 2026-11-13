"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Period } from "@/components/ui/PeriodPicker";
import { DEFAULT_PERIOD, periodWindows, type PeriodWindow } from "./period";

type ReportsPeriodValue = {
  period: Period;
  setPeriod: (p: Period) => void;
  /** The selected period and the equally long periods before it, oldest first. */
  windows: PeriodWindow[];
};

const ReportsPeriodContext = createContext<ReportsPeriodValue | null>(null);

/** Owns the Reports period so every history (KPIs, hovers, table, funnel) compares the same windows. */
export function ReportsPeriodProvider({ children }: { children: React.ReactNode }) {
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);
  const windows = useMemo(() => periodWindows(period), [period]);
  const value = useMemo(() => ({ period, setPeriod, windows }), [period, windows]);
  return <ReportsPeriodContext.Provider value={value}>{children}</ReportsPeriodContext.Provider>;
}

export function useReportsPeriod() {
  const ctx = useContext(ReportsPeriodContext);
  if (!ctx) throw new Error("useReportsPeriod must be used inside <ReportsPeriodProvider>");
  return ctx;
}
