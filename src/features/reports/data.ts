import type { ChartPoint } from "@/components/ui/LineChart";
import type { MetricHistory } from "@/components/ui/HistoryCard";
import type { TagTone } from "@/components/ui/Tag";

/**
 * Mock data for the Reports dashboard, mirroring the Figma "ATS New › Reports" frame.
 * Replace with API data once the reporting endpoints exist.
 */

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"] as const;

export const history = (values: number[]): ChartPoint[] =>
  MONTHS.map((label, i) => ({ label, value: values[i] ?? 0 }));

const DEFAULT_SERIES = history([30, 20, 65, 30, 95, 70]);
const DEFAULT_TARGET = 110;

const avatar = (file: string, name: string) => ({ src: `/assets/avatars/${file}`, name });

const RECRUITERS = [
  avatar("r1.png", "Daniel Park"),
  avatar("r2.png", "Marcus Lee"),
  avatar("r3.png", "Andre Silva"),
  avatar("r4.png", "Tom Becker"),
  avatar("r5.png", "Lucas Reyes"),
  avatar("r6.png", "Noah Klein"),
  avatar("r1.png", "Ethan Cole"),
  avatar("r2.png", "Owen Brooks"),
];

/* ---------- Team performance ---------- */

export type Alert = { tone: "error" | "warning"; title: string; detail: string };

export const ALERTS: Alert[] = [
  { tone: "error", title: "Technical pass rate declining", detail: "68% vs. 75% target · Down 2 pp" },
  { tone: "error", title: "Presentation accuracy below target", detail: "82% vs. 95% target · No recruiters on target" },
  { tone: "warning", title: "2 recruiters are slow to present", detail: "16–18 days vs. 14-day target" },
];

export type Kpi = {
  title: string;
  target: string;
  value: string;
  unit: string;
  /** "%" sits inline next to the value; "Days" stacks below it. */
  unitPlacement: "inline" | "below";
  tone: "error" | "success";
  trend: { direction: "up" | "down"; text: string };
  series: ChartPoint[];
  targetValue: number;
};

export const KPIS: Kpi[] = [
  {
    title: "Presented\n→ Hired",
    target: "Target: 85%",
    value: "22",
    unit: "%",
    unitPlacement: "inline",
    tone: "error",
    trend: { direction: "up", text: "+2% than prev period" },
    series: DEFAULT_SERIES,
    targetValue: DEFAULT_TARGET,
  },
  {
    title: "Time to First Presentation",
    target: "Target: 14 days",
    value: "12",
    unit: "Days",
    unitPlacement: "below",
    tone: "success",
    trend: { direction: "up", text: "2 days faster than prev period" },
    series: DEFAULT_SERIES,
    targetValue: DEFAULT_TARGET,
  },
  {
    title: "Presentation Accuracy",
    target: "Target: 95%",
    value: "82",
    unit: "%",
    unitPlacement: "inline",
    tone: "error",
    trend: { direction: "up", text: "+2 pts vs previous period" },
    series: DEFAULT_SERIES,
    targetValue: DEFAULT_TARGET,
  },
  {
    title: "Technical\nPass Rate",
    target: "Target: 95%",
    value: "68",
    unit: "%",
    unitPlacement: "inline",
    tone: "error",
    trend: { direction: "up", text: "+2 pts vs previous period" },
    series: DEFAULT_SERIES,
    targetValue: DEFAULT_TARGET,
  },
];

export type VacancySegment = {
  key: "filled" | "cancelled" | "open";
  label: string;
  value: number;
  color: string;
  history: MetricHistory;
};

export const VACANCIES: { segments: VacancySegment[]; trend: { value: string; text: string } } = {
  segments: [
    {
      key: "filled",
      label: "Filled",
      value: 12,
      color: "var(--teal-600)",
      history: { value: "Filled: 12", trend: { direction: "up", text: "+6 vs previous period" }, series: DEFAULT_SERIES, target: DEFAULT_TARGET },
    },
    {
      key: "cancelled",
      label: "Cancelled",
      value: 3,
      color: "var(--gray-500)",
      history: { value: "Cancelled: 3", trend: { direction: "down", text: "+1 vs previous period" }, series: DEFAULT_SERIES, target: DEFAULT_TARGET },
    },
    {
      key: "open",
      label: "Open",
      value: 45,
      color: "var(--purple-300)",
      history: { value: "Open: 45", trend: { direction: "down", text: "-2 vs previous period" }, series: DEFAULT_SERIES, target: DEFAULT_TARGET },
    },
  ],
  trend: { value: "+6", text: "from past month" },
};

/* ---------- Recruiter performance ---------- */

export type RecruiterGroup = {
  title: string;
  description: string;
  trend: { direction: "up" | "down"; text: string };
  tone: "success" | "error";
  recruiters: typeof RECRUITERS;
  maxAvatars: number;
  months: { month: string; recruiters: typeof RECRUITERS }[];
  defaultOpen?: boolean;
};

export const RECRUITER_GROUPS: RecruiterGroup[] = [
  {
    title: "Meeting All Targets",
    description: "Recruiters meeting all KPI targets",
    trend: { direction: "up", text: "+2 vs previous period" },
    tone: "success",
    recruiters: RECRUITERS.slice(0, 4),
    maxAvatars: 4,
    months: [
      { month: "September", recruiters: RECRUITERS.slice(0, 2) },
      { month: "August", recruiters: RECRUITERS.slice(0, 3) },
    ],
  },
  {
    title: "Needs Review",
    description: "Recruiters requiring attention.",
    trend: { direction: "up", text: "+2 vs previous period" },
    tone: "error",
    recruiters: RECRUITERS.slice(0, 7),
    maxAvatars: 5,
    defaultOpen: true,
    months: [
      { month: "September", recruiters: RECRUITERS.slice(0, 5) },
      { month: "August", recruiters: RECRUITERS.slice(0, 3) },
      { month: "July", recruiters: RECRUITERS.slice(0, 3) },
      { month: "June", recruiters: RECRUITERS.slice(0, 3) },
      { month: "May", recruiters: RECRUITERS.slice(0, 5) },
    ],
  },
];

export type MetricCell = {
  value: string;
  tone: TagTone;
  /** Headline shown in the hover card; defaults to "<column> <value>". */
  detail?: string;
  trend?: { direction: "up" | "down"; text: string };
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
    avatar: "/assets/avatars/camila.png",
    present: cell("28"),
    timeToFirstPres: cell("25%", "error"),
    techPass: cell("9 d"),
    hired: cell("89%", "success", { detail: "Hired 89% (7/28)", trend: { direction: "up", text: "+4% vs. prev" } }),
    presAccuracy: cell("75%"),
  },
  {
    name: "Sofia Martinez",
    avatar: "/assets/avatars/sofia.png",
    present: cell("26"),
    timeToFirstPres: cell("21%", "error"),
    techPass: cell("11 d", "success"),
    hired: cell("94%"),
    presAccuracy: cell("72%"),
  },
  {
    name: "Luna Garcia",
    avatar: "/assets/avatars/luna.png",
    present: cell("24"),
    timeToFirstPres: cell("87%"),
    techPass: cell("13 d"),
    hired: cell("90%"),
    presAccuracy: cell("80%"),
  },
  {
    name: "Isabella Torres",
    avatar: "/assets/avatars/isabella.png",
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

export const CELL_HISTORY = { series: DEFAULT_SERIES, target: DEFAULT_TARGET };

/* ---------- Hiring funnel ---------- */

export type FunnelStage = {
  label: string;
  value: number;
  color: string;
  trend: { direction: "up" | "down"; text: string };
};

export const FUNNEL_MAX = 215;

export const FUNNEL: FunnelStage[] = [
  { label: "Technically Evaluated", value: 215, color: "rgba(193, 245, 234, 0.83)", trend: { direction: "up", text: "+4% vs. prev" } },
  { label: "Passed Tech Assessment", value: 146, color: "var(--teal-300)", trend: { direction: "up", text: "+4% vs. prev" } },
  { label: "Presented\nto Client", value: 132, color: "var(--purple-300)", trend: { direction: "up", text: "+2% vs. prev" } },
  { label: "Interviewed\nby Client", value: 85, color: "var(--purple-400)", trend: { direction: "down", text: "-3% vs. prev" } },
  { label: "Offer\nExtended", value: 25, color: "var(--purple-500)", trend: { direction: "down", text: "-1% vs. prev" } },
  { label: "Hired", value: 12, color: "var(--purple-600)", trend: { direction: "up", text: "+2% vs. prev" } },
];

export const FUNNEL_LEGEND = [
  { label: "Internal", color: "var(--teal-600)" },
  { label: "External", color: "var(--purple-500)" },
];

export const FUNNEL_HISTORY = { series: DEFAULT_SERIES, target: DEFAULT_TARGET };

export const LOWEST_CONVERSION = {
  from: "Interviewed",
  to: "Offer",
  numerator: 25,
  numeratorLabel: "offers",
  denominator: 85,
  denominatorLabel: "interviews",
};
