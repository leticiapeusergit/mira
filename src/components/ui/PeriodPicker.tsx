"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DateRangeCalendar } from "./DateRangeCalendar";
import selectStyles from "./Select.module.css";
import styles from "./PeriodPicker.module.css";

export type Period = { kind: "preset"; label: string } | { kind: "custom"; start: Date; end: Date };

type PeriodPickerProps = {
  label: string;
  value: Period;
  presets: string[];
  onChange: (value: Period) => void;
  width?: number;
};

const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const withYear = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatRange = (start: Date, end: Date) =>
  start.getFullYear() === end.getFullYear()
    ? `${short.format(start)} – ${withYear.format(end)}`
    : `${withYear.format(start)} – ${withYear.format(end)}`;

const periodText = (p: Period) => (p.kind === "preset" ? p.label : formatRange(p.start, p.end));

/** "Label: Value" trigger that opens quick presets plus a calendar for a custom start/end. */
export function PeriodPicker({ label, value, presets, onChange, width }: PeriodPickerProps) {
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState<Date | null>(null);
  const [draftEnd, setDraftEnd] = useState<Date | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Seed the calendar with the current custom range each time the panel opens.
  const openPanel = () => {
    setDraftStart(value.kind === "custom" ? value.start : null);
    setDraftEnd(value.kind === "custom" ? value.end : null);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choosePreset = (preset: string) => {
    onChange({ kind: "preset", label: preset });
    setOpen(false);
  };

  const applyCustom = () => {
    if (!draftStart || !draftEnd) return;
    onChange({ kind: "custom", start: draftStart, end: draftEnd });
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={`${selectStyles.field} ${styles.trigger}`}
        style={{ width }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? setOpen(false) : openPanel())}
      >
        <span className={selectStyles.text}>
          {label}: <span className={selectStyles.value}>{periodText(value)}</span>
        </span>
        <img src="/assets/icons/select-chevron.svg" alt="" width={22} height={22} className={styles.chevron} />
      </button>

      <div id={panelId} role="dialog" aria-label={`${label} options`} className={styles.panel} data-open={open || undefined}>
        <ul className={styles.presets}>
          {presets.map((preset) => {
            const selected = value.kind === "preset" && value.label === preset;
            return (
              <li key={preset}>
                <button
                  type="button"
                  className={styles.preset}
                  aria-pressed={selected}
                  onClick={() => choosePreset(preset)}
                >
                  {preset}
                  {selected && <span className={styles.check} aria-hidden>✓</span>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.custom}>
          <p className={styles.customTitle}>Custom period</p>
          {open && (
            <DateRangeCalendar
              start={draftStart}
              end={draftEnd}
              onChange={(s, e) => {
                setDraftStart(s);
                setDraftEnd(e);
              }}
            />
          )}
          <div className={styles.footer}>
            <span className={styles.summary}>
              {draftStart && draftEnd
                ? formatRange(draftStart, draftEnd)
                : draftStart
                  ? `${short.format(draftStart)} – pick an end date`
                  : "Pick a start date"}
            </span>
            <button type="button" className={styles.apply} disabled={!draftStart || !draftEnd} onClick={applyCustom}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
