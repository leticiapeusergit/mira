"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";

export function TeamFilters() {
  const [talent, setTalent] = useState("All");
  const [period, setPeriod] = useState("Last 90 days");

  return (
    <>
      <Select label="Talent" value={talent} options={["All", "Internal", "External"]} onChange={setTalent} width={163} />
      <Select
        label="Period"
        value={period}
        options={["Last 30 days", "Last 90 days", "Last 6 months", "Last year"]}
        onChange={setPeriod}
        width={169}
      />
    </>
  );
}
