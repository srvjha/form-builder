"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { Skeleton }   from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { cn }         from "@/lib/utils";
import { trpc }       from "@/lib/trpc";

/* ── Palette: one blue family plus a neutral grey ─────────────
   Values are CSS variables set on the page root (see CHART_VARS)
   so each shade can shift for dark mode. Lightness follows the
   funnel: the further down the funnel, the stronger the blue. */
const C = {
  views:       "var(--chart-views)",
  starts:      "var(--chart-starts)",
  submissions: "var(--chart-submissions)",
  abandons:    "var(--chart-grey)",
  main:        "var(--chart-main)",
  grid:        "var(--border-muted)",
};

const CHART_VARS = cn(
  "[--chart-views:#93C5FD] [--chart-starts:#3B82F6] [--chart-submissions:#1E40AF] [--chart-grey:#A1A1AA] [--chart-main:#2563EB]",
  "dark:[--chart-views:#1D4ED8] dark:[--chart-starts:#60A5FA] dark:[--chart-submissions:#BFDBFE] dark:[--chart-grey:#525252] dark:[--chart-main:#3B82F6]",
);

const AXIS_TICK = { fontSize: 12, fontFamily: "var(--font-body)", fill: "var(--text-muted)" };
const LEGEND_STYLE = { fontSize: 13, fontFamily: "var(--font-body)", color: "var(--text-secondary)", paddingTop: 8 };

/* ── Date range options ────────────────────────────────────── */
const RANGES = [
  { label: "7 days",   days: 7  },
  { label: "30 days",  days: 30 },
  { label: "90 days",  days: 90 },
  { label: "All time", days: 0  },
] as const;

/* ── Helpers ───────────────────────────────────────────────── */
function fmt(n: number | null | undefined, suffix = "") {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M${suffix}`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k${suffix}`;
  return `${n}${suffix}`;
}

function pct(num: number, den: number) {
  if (!den) return 0;
  return Math.round((num / den) * 100);
}

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ── Sub-components ────────────────────────────────────────── */

function Panel({ title, className, children }: { title?: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]", className)}>
      {title && (
        <h3 className="px-4 pt-4 text-[15px] font-semibold text-[var(--text-primary)] sm:px-6 sm:pt-5">{title}</h3>
      )}
      {children}
    </section>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-5">
      <p className="text-[13px] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 font-display text-[32px] leading-none tabular-nums text-[var(--text-primary)]">{value}</p>
      {sub && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{sub}</p>}
    </div>
  );
}

/* Custom tooltip for charts */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[150px] rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-3 py-2.5 shadow-soft-md">
      {label != null && (
        <p className="mb-1.5 text-xs font-medium text-[var(--text-secondary)]">{label}</p>
      )}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? p.payload?.fill }} />
            <span className="text-[13px] text-[var(--text-secondary)]">{p.name}</span>
          </div>
          <span className="text-[13px] font-medium tabular-nums text-[var(--text-primary)]">
            {p.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rangeDays = Number(searchParams.get("days") ?? 30);

  const from = useMemo(() => {
    if (!rangeDays) return undefined;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - rangeDays);
    return d.toISOString();
  }, [rangeDays]);

  const { data, isLoading, error, refetch } = trpc.forms.analytics.useQuery(
    { formId: id, from },
    { enabled: !!id },
  );

  function setRange(days: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("days", String(days));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  if (error) return (
    <div className="p-6"><ErrorState description={error.message} onRetry={refetch} /></div>
  );

  /* ── Derived metrics ──────────────────────────────────────── */
  const views       = data?.totalViews       ?? 0;
  const uniqueViews = data?.uniqueViews      ?? 0;
  const starts      = data?.totalStarts      ?? 0;
  const submissions = data?.totalSubmissions ?? 0;
  const abandons    = data?.totalAbandons    ?? 0;
  const avgMs       = data?.avgCompletionTimeMs ?? null;
  const avgSec      = avgMs ? Math.round(avgMs / 1000) : null;
  const avgMin      = avgSec && avgSec >= 60 ? `${Math.floor(avgSec / 60)}m ${avgSec % 60}s` : avgSec ? `${avgSec}s` : null;

  const startRate   = pct(starts,      views);
  const completion  = pct(submissions, starts);
  const abandonRate = pct(abandons,    starts);

  /* ── Chart data ───────────────────────────────────────────── */
  type DailyEvent = { date: string; views: number; starts: number; submissions: number; abandons: number };
  type Referrer   = { referrer: string; count: number };

  const daily = ((data?.dailyEvents ?? []) as DailyEvent[]).map((d) => ({
    ...d,
    date: fmtDate(d.date),
  }));

  const funnelData = [
    { name: "Viewed",    value: views,       fill: C.views       },
    { name: "Started",   value: starts,      fill: C.starts      },
    { name: "Submitted", value: submissions, fill: C.submissions },
    { name: "Abandoned", value: abandons,    fill: C.abandons    },
  ];

  const pieData = funnelData.filter((d) => d.value > 0);

  const referrers = ((data?.topReferrers ?? []) as Referrer[]).slice(0, 8).map((r) => ({
    name: r.referrer.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] ?? r.referrer,
    count: r.count,
  }));

  const countries = (data?.topCountries ?? []).slice(0, 8);

  return (
    <div className={cn("h-full overflow-y-auto", CHART_VARS)}>
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:space-y-6 sm:p-8">

        {/* ── Header + date filter ──────────────────────────── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-[32px] text-[var(--text-primary)]">Analytics</h1>

          <div
            role="group"
            aria-label="Date range"
            className="flex max-w-full overflow-x-auto rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] p-0.5"
          >
            {RANGES.map(({ label, days }) => {
              const active = days === 0 ? rangeDays === 0 : rangeDays === days;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRange(days)}
                  className={cn(
                    "whitespace-nowrap rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── KPI row: one panel, numbers side by side ─────────── */}
        <Panel className="overflow-hidden">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-4 py-5 sm:px-6"><Skeleton className="h-14" /></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-px bg-[var(--border-muted)] sm:grid-cols-3 lg:grid-cols-6 [&>*]:bg-[var(--bg-panel)]">
              <Kpi label="Views"        value={fmt(views)} />
              <Kpi label="Unique views" value={fmt(uniqueViews)} sub={views ? `${pct(uniqueViews, views)}% of views` : undefined} />
              <Kpi label="Started"      value={fmt(starts)}      sub={`${startRate}% start rate`} />
              <Kpi label="Submitted"    value={fmt(submissions)} sub={`${completion}% completion`} />
              <Kpi label="Abandoned"    value={fmt(abandons)}    sub={`${abandonRate}% of starters`} />
              <Kpi label="Average time" value={avgMin ?? "—"}    sub="to complete" />
            </div>
          )}
        </Panel>

        {/* ── Daily trend chart (full width) ───────────────────── */}
        <Panel title="Traffic over time">
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : daily.length === 0 ? (
              <EmptyChart message="No visits in this period yet." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid stroke={C.grid} vertical={false} />
                  <XAxis dataKey="date" tick={AXIS_TICK} tickLine={false} axisLine={false} minTickGap={16} />
                  <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border-color)" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={LEGEND_STYLE} />
                  <Area type="monotone" dataKey="views"       name="Views"       stroke={C.views}       fill={C.views}       fillOpacity={0.12} strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="starts"      name="Starts"      stroke={C.starts}      fill={C.starts}      fillOpacity={0.10} strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="submissions" name="Submissions" stroke={C.submissions} fill={C.submissions} fillOpacity={0.10} strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="abandons"    name="Abandons"    stroke={C.abandons}    fill="transparent"   strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        {/* ── Funnel + Pie row ─────────────────────────────────── */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">

          {/* Funnel */}
          <Panel title="Conversion funnel" className="lg:col-span-3">
            <div className="space-y-4 p-4 sm:p-6">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)
                : funnelData.map(({ name, value, fill }) => {
                    const barPct = views > 0 ? (value / views) * 100 : 0;
                    return (
                      <div key={name} className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-sm text-[var(--text-primary)]">{name}</span>
                          <span className="text-sm tabular-nums text-[var(--text-secondary)]">
                            {value.toLocaleString()}
                            <span className="ml-3 inline-block w-10 text-right font-medium text-[var(--text-primary)]">
                              {Math.round(barPct)}%
                            </span>
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-inset)]">
                          <div
                            className="h-full rounded-full transition-[width] duration-500 ease-out"
                            style={{ width: `${barPct}%`, background: fill }}
                          />
                        </div>
                      </div>
                    );
                  })}
            </div>
          </Panel>

          {/* Event distribution */}
          <Panel title="Event distribution" className="lg:col-span-2">
            <div className="p-4 sm:p-6">
              {isLoading ? (
                <Skeleton className="h-52 w-full" />
              ) : pieData.length === 0 ? (
                <EmptyChart message="No events yet. Share your form to start collecting." />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="var(--bg-panel)"
                        strokeWidth={2}
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ul className="mt-3 divide-y divide-[var(--border-muted)]">
                    {pieData.map(({ name, value, fill }) => (
                      <li key={name} className="flex items-center justify-between py-1.5">
                        <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <span className="h-2 w-2 rounded-full" style={{ background: fill }} />
                          {name}
                        </span>
                        <span className="text-sm font-medium tabular-nums text-[var(--text-primary)]">{value.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Panel>
        </div>

        {/* ── Daily submissions bar chart ───────────────────────── */}
        <Panel title="Daily submissions">
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : daily.length === 0 ? (
              <EmptyChart message="No submissions in this period yet." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -16 }} maxBarSize={18}>
                  <CartesianGrid stroke={C.grid} vertical={false} />
                  <XAxis dataKey="date" tick={AXIS_TICK} tickLine={false} axisLine={false} minTickGap={16} />
                  <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--bg-inset)" }} />
                  <Bar dataKey="submissions" name="Submissions" fill={C.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        {/* ── Referrers + Countries row ─────────────────────────── */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">

          <Panel title="Top referrers">
            <div className="p-4 sm:p-6">
              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : referrers.length === 0 ? (
                <EmptyChart message="No referrers yet. Visits from shared links will show here." />
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(referrers.length * 36, 120)}>
                  <BarChart
                    layout="vertical"
                    data={referrers}
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                    barSize={14}
                  >
                    <CartesianGrid stroke={C.grid} horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" width={110} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--bg-inset)" }} />
                    <Bar dataKey="count" name="Visits" fill={C.main} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>

          <Panel title="Top countries">
            <div className="p-4 sm:p-6">
              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : countries.length === 0 ? (
                <EmptyChart message="No country data. IP geolocation is not configured." />
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(countries.length * 36, 120)}>
                  <BarChart
                    layout="vertical"
                    data={countries}
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                    barSize={14}
                  >
                    <CartesianGrid stroke={C.grid} horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="country" width={60} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--bg-inset)" }} />
                    <Bar dataKey="count" name="Views" fill={C.main} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>
        </div>

        {/* ── Views, starts and submissions compared (line) ────── */}
        <Panel title="Views, starts and submissions">
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : daily.length === 0 ? (
              <EmptyChart message="No visits in this period yet." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid stroke={C.grid} vertical={false} />
                  <XAxis dataKey="date" tick={AXIS_TICK} tickLine={false} axisLine={false} minTickGap={16} />
                  <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border-color)" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={LEGEND_STYLE} />
                  <Line type="monotone" dataKey="views"       name="Views"       stroke={C.views}       strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: "var(--bg-panel)", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="starts"      name="Starts"      stroke={C.starts}      strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: "var(--bg-panel)", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="submissions" name="Submissions" stroke={C.submissions} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: "var(--bg-panel)", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        {/* ── Summary ───────────────────────────────────────────── */}
        {!isLoading && data && (
          <Panel title="Summary">
            <dl className="grid grid-cols-2 sm:grid-cols-4">
              {[
                { label: "Events tracked",        value: (views + starts + submissions + abandons).toLocaleString() },
                { label: "Views to submissions",  value: `${pct(submissions, views)}%` },
                { label: "Unique visitor ratio",  value: views ? `${pct(uniqueViews, views)}%` : "—" },
                { label: "Average time",          value: avgMin ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} className="px-4 py-4 sm:px-6">
                  <dt className="text-[13px] text-[var(--text-secondary)]">{label}</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums text-[var(--text-primary)]">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        )}

      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-md bg-[var(--bg-inset)] px-4 text-center">
      <p className="text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}
