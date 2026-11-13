import type { TagTone } from "@/components/ui/Tag";
import type { HistorySpec } from "./history";

/**
 * Mock data for the Reports dashboard, mirroring the Figma "ATS New › Reports" frame.
 * Replace with API data once the reporting endpoints exist.
 */

/* ---------- Time in process (stacked timelines) ---------- */

export type TimelineStage = { key: string; label: string; color: string };
export type TimelineRow = { month: string; days: number[] };
export type StageTimeline = { title: string; stages: TimelineStage[]; rows: TimelineRow[] };

/** Business days spent per stage, per month (values measured from the Figma mock). */
const PROCESS_DAYS: TimelineRow[] = [
  { month: "October", days: [4.9, 6.8, 5.6, 2.8, 2.4, 3.5] },
  { month: "September", days: [4.1, 8.2, 2.6, 4.0, 3.8, 3.8] },
  { month: "August", days: [4.0, 9.1, 3.6, 2.2, 2.7, 5.5] },
  { month: "July", days: [3.9, 5.6, 3.9, 4.1, 4.0, 4.6] },
  { month: "June", days: [5.2, 5.2, 3.2, 5.1, 3.0, 6.1] },
  { month: "May", days: [4.0, 1.7, 7.7, 5.2, 4.9, 3.2] },
];

export const TIMELINE_MAX_DAYS = 30;

/** Stage labels use "\n" where the Figma legend wraps. */
export const PROCESS_EFFICIENCY: StageTimeline[] = [
  {
    title: "Prediktive Process Time",
    stages: [
      { key: "hr-scheduling", label: "HR\nScheduling", color: "var(--bluegray-100)" },
      { key: "hr-interview", label: "HR\nInterview", color: "var(--bluegray-200)" },
      { key: "technical-review", label: "Technical\nReview", color: "var(--bluegray-300)" },
      { key: "technical-evaluation", label: "Technical\nEvaluation", color: "var(--bluegray-500)" },
      { key: "final-decision", label: "Final\nDecision", color: "var(--brand-950)" },
      { key: "tests", label: "Tests", color: "var(--gray-300)" },
    ],
    rows: PROCESS_DAYS,
  },
  {
    title: "Job Application Process Time",
    stages: [
      { key: "technical-evaluation", label: "Technical\nEvaluation", color: "var(--purple-100)" },
      { key: "passed-tech", label: "Passed Tech\nAssessment", color: "var(--purple-200)" },
      { key: "presented", label: "Presented\nto Client", color: "var(--purple-300)" },
      { key: "offer", label: "Offer\nExtended", color: "var(--purple-500)" },
      { key: "hired", label: "Hired", color: "var(--purple-900)" },
    ],
    rows: PROCESS_DAYS.map((r) => ({ month: r.month, days: r.days.slice(0, 5) })),
  },
];

/* ---------- Team performance ---------- */

export type KpiKey = "presented-hired" | "time-to-first-presentation" | "presentation-accuracy" | "technical-pass-rate";

/** Each alert points at the KPI it's about; clicking it focuses that KPI card. */
export type Alert = { tone: "error" | "warning"; title: string; detail: string; kpi: KpiKey };

export const ALERTS: Alert[] = [
  { tone: "error", title: "Technical pass rate declining", detail: "68% vs. 75% target · Down 2 pp", kpi: "technical-pass-rate" },
  {
    tone: "error",
    title: "Presentation accuracy below target",
    detail: "82% vs. 95% target · No recruiters on target",
    kpi: "presentation-accuracy",
  },
  { tone: "warning", title: "2 recruiters are slow to present", detail: "16–18 days vs. 14-day target", kpi: "time-to-first-presentation" },
];

export type Kpi = {
  id: KpiKey;
  title: string;
  target: string;
  unit: string;
  /** "%" sits inline next to the value; "Days" stacks below it. */
  unitPlacement: "inline" | "below";
  tone: "error" | "success";
  /** Copy for the change vs the previous period; must agree with `history`. */
  trend: { direction: "up" | "down"; text: string };
  /** Value in the selected period and in the one before it; the badge shows `current`. */
  history: HistorySpec;
  targetValue: number;
  /** Y-axis in the KPI's own unit, so the chart measures the same thing as the badge. */
  axis: "percent" | "days";
};

export const KPIS: Kpi[] = [
  {
    id: "presented-hired",
    title: "Presented\n→ Hired",
    target: "Target: 85%",
    unit: "%",
    unitPlacement: "inline",
    tone: "error",
    trend: { direction: "up", text: "+2% than prev period" },
    history: { current: 22, previous: 20, seed: 1, min: 0, max: 100 },
    targetValue: 85,
    axis: "percent",
  },
  {
    id: "time-to-first-presentation",
    title: "Time to First Presentation",
    target: "Target: 14 days",
    unit: "Days",
    unitPlacement: "below",
    tone: "success",
    trend: { direction: "up", text: "2 days faster than prev period" },
    history: { current: 12, previous: 14, seed: 2, min: 0, max: 20, lowerIsBetter: true },
    targetValue: 14,
    axis: "days",
  },
  {
    id: "presentation-accuracy",
    title: "Presentation Accuracy",
    target: "Target: 95%",
    unit: "%",
    unitPlacement: "inline",
    tone: "error",
    trend: { direction: "up", text: "+2 pts vs previous period" },
    history: { current: 82, previous: 80, seed: 3, min: 0, max: 100 },
    targetValue: 95,
    axis: "percent",
  },
  {
    id: "technical-pass-rate",
    title: "Technical\nPass Rate",
    target: "Target: 95%",
    unit: "%",
    unitPlacement: "inline",
    tone: "error",
    // Matches the alert: "Down 2 pp".
    trend: { direction: "down", text: "-2 pts vs previous period" },
    history: { current: 68, previous: 70, seed: 4, min: 0, max: 100 },
    targetValue: 95,
    axis: "percent",
  },
];

export type VacancySegment = {
  key: "filled" | "cancelled" | "open";
  label: string;
  color: string;
  history: HistorySpec;
};

export const VACANCIES: VacancySegment[] = [
  { key: "filled", label: "Filled", color: "var(--teal-600)", history: { current: 12, previous: 6, seed: 11 } },
  {
    key: "cancelled",
    label: "Cancelled",
    color: "var(--gray-500)",
    history: { current: 3, previous: 2, seed: 12, lowerIsBetter: true },
  },
  { key: "open", label: "Open", color: "var(--purple-300)", history: { current: 45, previous: 47, seed: 13, lowerIsBetter: true } },
];

/* ---------- Recruiter performance ---------- */

const avatar = (file: string) => `/assets/avatars/${file}`;

export type KpiResult = { label: string; value: string; met: boolean };

export type Recruiter = {
  name: string;
  avatar: string;
  /** Results in the selected period; groups show the misses (or all hits). */
  kpis: KpiResult[];
  /** Whether the recruiter was in this group in each period, oldest first (last = current). */
  streak: boolean[];
};

export type RecruiterGroup = {
  id: "meeting" | "needs-review";
  title: string;
  description: string;
  tone: "success" | "error";
  maxAvatars: number;
  /** Group size in the selected and previous period. */
  history: HistorySpec;
  recruiters: Recruiter[];
};

const kpi = (label: string, value: string, met: boolean): KpiResult => ({ label, value, met });

/** Same people as the table below, so tags and table always agree. */
export const RECRUITER_GROUPS: RecruiterGroup[] = [
  {
    id: "meeting",
    title: "Meeting All Targets",
    description: "Recruiters meeting all KPI targets",
    tone: "success",
    maxAvatars: 4,
    history: { current: 4, previous: 2, seed: 21, min: 0 },
    recruiters: [
      {
        name: "Luna Garcia",
        avatar: avatar("luna.png"),
        kpis: [kpi("Hired", "90%", true), kpi("Pres. Accuracy", "80%", true), kpi("Tech Pass", "13 d", true)],
        streak: [false, true, true, true, true, true],
      },
      {
        name: "Daniel Park",
        avatar: avatar("r1.png"),
        kpis: [kpi("Hired", "88%", true), kpi("Pres. Accuracy", "96%", true)],
        streak: [true, true, false, true, true, true],
      },
      {
        name: "Marcus Lee",
        avatar: avatar("r2.png"),
        kpis: [kpi("Hired", "86%", true), kpi("Pres. Accuracy", "95%", true)],
        streak: [false, false, false, false, true, true],
      },
      {
        name: "Andre Silva",
        avatar: avatar("r3.png"),
        kpis: [kpi("Hired", "91%", true), kpi("Tech Pass", "78%", true)],
        streak: [false, false, false, false, false, true],
      },
    ],
  },
  {
    id: "needs-review",
    title: "Needs Review",
    description: "Recruiters requiring attention.",
    tone: "error",
    maxAvatars: 5,
    history: { current: 7, previous: 5, seed: 22, min: 0 },
    recruiters: [
      {
        name: "Isabella Torres",
        avatar: avatar("isabella.png"),
        kpis: [kpi("Hired", "30%", false), kpi("Pres. Accuracy", "61%", false)],
        streak: [false, true, true, true, true, true],
      },
      {
        name: "Camila Rojas",
        avatar: avatar("camila.png"),
        kpis: [kpi("Time to First Pres", "25%", false)],
        streak: [false, false, false, true, true, true],
      },
      {
        name: "Sofia Martinez",
        avatar: avatar("sofia.png"),
        kpis: [kpi("Time to First Pres", "21%", false)],
        streak: [true, false, false, false, true, true],
      },
      {
        name: "Tom Becker",
        avatar: avatar("r4.png"),
        kpis: [kpi("Time to First Pres", "18 d", false), kpi("Tech Pass", "64%", false)],
        streak: [false, false, false, false, true, true],
      },
      {
        name: "Lucas Reyes",
        avatar: avatar("r5.png"),
        kpis: [kpi("Time to First Pres", "16 d", false)],
        streak: [false, false, false, false, false, true],
      },
      {
        name: "Noah Klein",
        avatar: avatar("r6.png"),
        kpis: [kpi("Pres. Accuracy", "70%", false)],
        streak: [true, true, false, false, false, true],
      },
      {
        name: "Ethan Cole",
        avatar: avatar("r1.png"),
        kpis: [kpi("Hired", "62%", false)],
        streak: [false, false, false, false, false, true],
      },
    ],
  },
];

export type MetricCell = {
  value: string;
  tone: TagTone;
  /** Value in the previous period; defaults to a small deterministic change. */
  previous?: number;
  /** Extra context in the hover headline, e.g. "(7/28)". */
  note?: string;
};

export type RecruiterRow = {
  name: string;
  avatar: string;
  present: MetricCell;
  timeToFirstPres: MetricCell;
  techPass: MetricCell;
  hired: MetricCell;
  presAccuracy: MetricCell;
};

const cell = (value: string, tone: TagTone = "neutral", extra: Partial<MetricCell> = {}): MetricCell => ({
  value,
  tone,
  ...extra,
});

export const RECRUITER_ROWS: RecruiterRow[] = [
  {
    name: "Camila Rojas",
    avatar: avatar("camila.png"),
    present: cell("28"),
    timeToFirstPres: cell("25%", "error"),
    techPass: cell("9 d"),
    hired: cell("89%", "success", { previous: 85, note: "(7/28)" }),
    presAccuracy: cell("75%"),
  },
  {
    name: "Sofia Martinez",
    avatar: avatar("sofia.png"),
    present: cell("26"),
    timeToFirstPres: cell("21%", "error"),
    techPass: cell("11 d", "success"),
    hired: cell("94%"),
    presAccuracy: cell("72%"),
  },
  {
    name: "Luna Garcia",
    avatar: avatar("luna.png"),
    present: cell("24"),
    timeToFirstPres: cell("87%"),
    techPass: cell("13 d"),
    hired: cell("90%"),
    presAccuracy: cell("80%"),
  },
  {
    name: "Isabella Torres",
    avatar: avatar("isabella.png"),
    present: cell("19"),
    timeToFirstPres: cell("87%"),
    techPass: cell("13 d"),
    hired: cell("30%", "error"),
    presAccuracy: cell("61%", "error"),
  },
];

export const RECRUITER_COLUMNS: { key: keyof Omit<RecruiterRow, "name" | "avatar">; label: string; target?: string }[] = [
  { key: "present", label: "Present" },
  { key: "timeToFirstPres", label: "Time to First Pres", target: "T:-14d" },
  { key: "techPass", label: "Tech Pass", target: "T:+ 75%" },
  { key: "hired", label: "Hired", target: "T:+85%" },
  { key: "presAccuracy", label: "Pres. Accuracy", target: "T: +95%" },
];

/** Splits "25%" / "9 d" / "28" into a number and its unit. */
export function parseMetric(value: string): { amount: number; unit: "%" | "d" | "" } {
  const amount = Number.parseFloat(value);
  const unit = value.includes("%") ? "%" : /\bd\b/.test(value) ? "d" : "";
  return { amount, unit };
}

/** Target number from a column header like "T:+85%" or "T:-14d", if its unit matches the cell. */
export function columnTarget(target: string | undefined, unit: string): number | undefined {
  if (!target) return undefined;
  const targetUnit = target.includes("%") ? "%" : target.includes("d") ? "d" : "";
  if (targetUnit !== unit) return undefined;
  const n = Number.parseFloat(target.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/* ---------- Hiring funnel ---------- */

export type FunnelStage = {
  label: string;
  color: string;
  history: HistorySpec;
};

export const FUNNEL_MAX = 215;

export const FUNNEL: FunnelStage[] = [
  { label: "Technically Evaluated", color: "rgba(193, 245, 234, 0.83)", history: { current: 215, previous: 207, seed: 31 } },
  { label: "Passed Tech Assessment", color: "var(--teal-300)", history: { current: 146, previous: 140, seed: 32 } },
  { label: "Presented\nto Client", color: "var(--purple-300)", history: { current: 132, previous: 129, seed: 33 } },
  { label: "Interviewed\nby Client", color: "var(--purple-400)", history: { current: 85, previous: 88, seed: 34 } },
  { label: "Offer\nExtended", color: "var(--purple-500)", history: { current: 25, previous: 26, seed: 35 } },
  { label: "Hired", color: "var(--purple-600)", history: { current: 12, previous: 11, seed: 36 } },
];

export const FUNNEL_LEGEND = [
  { label: "Internal", color: "var(--teal-600)" },
  { label: "External", color: "var(--purple-500)" },
];

export const LOWEST_CONVERSION = {
  from: "Interviewed",
  to: "Offer",
  numerator: 25,
  numeratorLabel: "offers",
  denominator: 85,
  denominatorLabel: "interviews",
};
