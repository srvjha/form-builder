import { format, parseISO } from "date-fns";

/* ── Shared chart styling ─────────────────────────────────────
   One hue for every mark: the accent blue token. Grid and ticks
   stay recessive; text always uses the text tokens. */
export const CHART_COLOR = "var(--color-accent)";
export const GRID_COLOR = "var(--border-muted)";
export const AXIS_TICK = {
  fontSize: 12,
  fontFamily: "var(--font-body)",
  fill: "var(--text-muted)",
} as const;

/* The selectable ranges used by the analytics and admin pages */
export const RANGE_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
] as const;

export function parseDays(raw: string | null | undefined, fallback = 30): number {
  const n = Number(raw);
  return n === 7 || n === 30 || n === 90 ? n : fallback;
}

/* Normalise a date coming back from the API to "YYYY-MM-DD" */
export function toDayKey(d: unknown): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

/* The last `days` calendar days (UTC, matching the server window), oldest first */
export function lastDays(days: number, now = new Date()): string[] {
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    out.push(new Date(end - i * 86_400_000).toISOString().slice(0, 10));
  }
  return out;
}

/* Fill the gaps in a sparse daily series with zeros for every day in range */
export function fillDays<K extends string>(
  rows: ReadonlyArray<{ date: unknown } & Partial<Record<K, number>>>,
  days: number,
  keys: readonly K[],
): Array<{ date: string } & Record<K, number>> {
  const byDate = new Map(rows.map((r) => [toDayKey(r.date), r]));
  return lastDays(days).map((date) => {
    const row = byDate.get(date);
    const filled = { date } as { date: string } & Record<K, number>;
    for (const k of keys) (filled as Record<string, unknown>)[k] = Number(row?.[k] ?? 0);
    return filled;
  });
}

/* Date-only strings parse as local midnight, so the label never shifts a day */
export function formatDay(date: string, pattern = "MMM d"): string {
  try {
    return format(parseISO(date), pattern);
  } catch {
    return date;
  }
}

export function formatCount(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toLocaleString();
}

export function percent(num: number, den: number): number {
  return den > 0 ? Math.round((num / den) * 100) : 0;
}

export function formatDuration(ms: number | null | undefined): string {
  if (!ms) return "—";
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ${sec % 60}s`;
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}
