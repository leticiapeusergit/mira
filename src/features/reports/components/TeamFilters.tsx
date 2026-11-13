"use client";

import { useState } from "react";
import { PeriodPicker } from "@/components/ui/PeriodPicker";
import { Select } from "@/components/ui/Select";
import { PERIOD_PRESETS } from "../period";
import { useReportsPeriod } from "../ReportsPeriodContext";

export function TeamFilters() {
  const [talent, setTalent] = useState("All");
  const { period, setPeriod } = useReportsPeriod();

  return (
    <>
      <Select label="Talent" value={talent} options={["All", "Internal", "External"]} onChange={setTalent} width={163} />
      <PeriodPicker label="Period" value={period} presets={PERIOD_PRESETS} onChange={setPeriod} />
    </>
  );
}
