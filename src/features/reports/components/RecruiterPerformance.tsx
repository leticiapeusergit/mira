"use client";

import { useEffect, useState } from "react";
import { RECRUITER_GROUPS, type RecruiterGroup } from "../data";
import { RecruiterGroupCard } from "./RecruiterGroupCard";
import { RecruitersTable } from "./RecruitersTable";
import page from "../ReportsPage.module.css";

/** Group cards filter the recruiters table: click a group to show only its people, click again (or Esc) to clear. */
export function RecruiterPerformance() {
  const [selected, setSelected] = useState<RecruiterGroup["id"] | null>(null);
  const group = RECRUITER_GROUPS.find((g) => g.id === selected);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div className={page.group}>
      <div className={`${page.row} ${page.alignStart}`}>
        {RECRUITER_GROUPS.map((g) => (
          <RecruiterGroupCard
            key={g.id}
            {...g}
            active={selected === g.id}
            dimmed={!!selected && selected !== g.id}
            onSelect={() => setSelected((current) => (current === g.id ? null : g.id))}
          />
        ))}
      </div>
      <RecruitersTable names={group?.recruiters.map((r) => r.name)} />
    </div>
  );
}
