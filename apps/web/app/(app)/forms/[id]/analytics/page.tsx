"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Eye, MousePointerClick, Send, Clock, TrendingUp, TrendingDown,
  Users, XCircle, BarChart2, Calendar,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { Skeleton }   from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { cn }         from "@/lib/utils";
import { trpc }       from "@/lib/trpc";

/* ── Palette ──────────────────────────────────────────────── */
const C = {
  accent:  "#FF3B00",
  blue:    "#0066CC",
  green:   "#00C853",
  yellow:  "#FFD600",
  purple:  "#7B2FBE",
  red:     "#D50000",
  muted:   "#888888",
};

const CHART_COLORS = [C.accent, C.blue, C.green, C.yellow, C.purple, C.red];

/* ── Date range options ────────────────────────────────────── */
const RANGES = [
  { label: "7d",  days: 7  },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "All", days: 0  },
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

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b-2 border-[#0A0A0A] px-6 py-3 bg-[var(--bg-inset)]">
      <p className="label-overline">{children}</p>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  trend,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A] p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-8 w-8 items-center justify-center border-2 border-[#0A0A0A]"
          style={{ background: color ?? C.accent }}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        {trend === "up"      && <TrendingUp   className="h-4 w-4 text-[var(--color-green)]" />}
        {trend === "down"    && <TrendingDown  className="h-4 w-4 text-[var(--color-red)]"   />}
      </div>
      <div>
        <p className="font-display text-3xl font-black tracking-tight" style={{ color: color ?? "var(--text-primary)" }}>
          {value}
        </p>
        <p className="mt-0.5 font-display text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </p>
        {sub && <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">{sub}</p>}
      </div>
    </motion.div>
  );
}

/* Custom tooltip for charts */
function BrutalistTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[4px_4px_0_#0A0A0A] px-4 py-3 min-w-[140px]">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
        {label}
      </p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 border border-[#0A0A0A]" style={{ background: p.color }} />
            <span className="font-mono text-xs capitalize text-[var(--text-muted)]">{p.name}</span>
          </div>
          <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
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
    { name: "Viewed",    value: views,       fill: C.blue   },
    { name: "Started",   value: starts,      fill: C.yellow },
    { name: "Submitted", value: submissions,  fill: C.green  },
    { name: "Abandoned", value: abandons,     fill: C.red    },
  ];

  const pieData = funnelData.filter((d) => d.value > 0);

  const referrers = ((data?.topReferrers ?? []) as Referrer[]).slice(0, 8).map((r) => ({
    name: r.referrer.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] ?? r.referrer,
    count: r.count,
  }));

  const countries = (data?.topCountries ?? []).slice(0, 8);

  return (
    <div className="h-full overflow-y-auto bg-[var(--bg-page)]">
      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* ── Header + date filter ──────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--color-accent)]">
              <BarChart2 className="h-4 w-4 text-white" />
            </div>
            <h1 className="font-display text-lg font-black uppercase tracking-tight">Analytics</h1>
          </div>

          {/* Range selector */}
          <div className="flex items-center gap-0 border-2 border-[#0A0A0A]">
            <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)] mx-3" />
            {RANGES.map(({ label, days }) => (
              <button
                key={label}
                onClick={() => setRange(days)}
                className={cn(
                  "px-4 py-2 font-display text-xs font-extrabold uppercase tracking-wider border-l-2 border-[#0A0A0A] transition-colors",
                  (days === 0 ? rangeDays === 0 : rangeDays === days)
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-[var(--bg-panel)] hover:bg-[var(--bg-inset)] text-[var(--text-primary)]",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI row ──────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
            <KpiCard icon={Eye}              label="Total Views"    value={fmt(views)}       color={C.blue}   delay={0}    />
            <KpiCard icon={Users}            label="Unique Views"   value={fmt(uniqueViews)} color={C.purple} delay={0.04} sub={views ? `${pct(uniqueViews, views)}% of total` : undefined} />
            <KpiCard icon={MousePointerClick} label="Started"        value={fmt(starts)}      color={C.yellow} delay={0.08} trend={startRate >= 40 ? "up" : "down"} sub={`${startRate}% start rate`} />
            <KpiCard icon={Send}             label="Submitted"      value={fmt(submissions)} color={C.green}  delay={0.12} trend={completion >= 60 ? "up" : "down"} sub={`${completion}% completion`} />
            <KpiCard icon={XCircle}          label="Abandoned"      value={fmt(abandons)}    color={C.red}    delay={0.16} sub={`${abandonRate}% of starters`} />
            <KpiCard icon={Clock}            label="Avg Time"       value={avgMin ?? "—"}    color={C.accent} delay={0.20} />
          </div>
        )}

        {/* ── Rate cards row ───────────────────────────────────── */}
        {!isLoading && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Start rate",      value: startRate,   good: startRate >= 40,   sub: "viewers who started" },
              { label: "Completion rate", value: completion,  good: completion >= 60,  sub: "starters who submitted" },
              { label: "Abandon rate",    value: abandonRate, good: abandonRate < 30,  sub: "starters who left" },
            ].map(({ label, value, good, sub }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A] p-5 flex items-center gap-5"
              >
                <div>
                  <p className="font-display text-5xl font-black" style={{ color: good ? C.green : C.red }}>
                    {value}%
                  </p>
                  <p className="mt-0.5 font-display text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                    {label}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">{sub}</p>
                </div>
                <div className="ml-auto">
                  {good
                    ? <TrendingUp  className="h-8 w-8 text-[var(--color-green)]" />
                    : <TrendingDown className="h-8 w-8 text-[var(--color-red)]"   />}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Daily trend chart (full width) ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]"
        >
          <SectionHeader>Traffic over time</SectionHeader>
          <div className="p-6">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : daily.length === 0 ? (
              <EmptyChart message="No event data for this period." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    {[
                      { id: "views",       color: C.blue   },
                      { id: "starts",      color: C.yellow },
                      { id: "submissions", color: C.green  },
                      { id: "abandons",    color: C.red    },
                    ].map(({ id, color }) => (
                      <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<BrutalistTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }} />
                  <Area type="monotone" dataKey="views"       name="Views"       stroke={C.blue}   fill={`url(#grad-views)`}       strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="starts"      name="Starts"      stroke={C.yellow} fill={`url(#grad-starts)`}      strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="submissions" name="Submissions" stroke={C.green}  fill={`url(#grad-submissions)`} strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="abandons"    name="Abandons"    stroke={C.red}    fill={`url(#grad-abandons)`}    strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* ── Funnel + Pie row ─────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-5">

          {/* Funnel bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3 border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]"
          >
            <SectionHeader>Conversion funnel</SectionHeader>
            <div className="p-6 space-y-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)
                : funnelData.map(({ name, value, fill }) => {
                    const barPct = views > 0 ? (value / views) * 100 : 0;
                    return (
                      <div key={name} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 border border-[#0A0A0A]" style={{ background: fill }} />
                            <span className="font-display text-xs font-extrabold uppercase tracking-wide">{name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs tabular-nums text-[var(--text-muted)]">{value.toLocaleString()}</span>
                            <span className="w-12 text-right font-display text-sm font-extrabold" style={{ color: fill }}>
                              {Math.round(barPct)}%
                            </span>
                          </div>
                        </div>
                        <div className="h-3 w-full border-2 border-[#0A0A0A] bg-[var(--bg-inset)]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barPct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full"
                            style={{ background: fill }}
                          />
                        </div>
                      </div>
                    );
                  })}
            </div>
          </motion.div>

          {/* Event distribution pie */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="lg:col-span-2 border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]"
          >
            <SectionHeader>Event distribution</SectionHeader>
            <div className="p-4">
              {isLoading ? (
                <Skeleton className="h-52 w-full" />
              ) : pieData.length === 0 ? (
                <EmptyChart message="No data yet." />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} stroke="#0A0A0A" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip content={<BrutalistTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 space-y-1.5">
                    {pieData.map(({ name, value, fill }) => (
                      <div key={name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 border border-[#0A0A0A]" style={{ background: fill }} />
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{name}</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold tabular-nums">{value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Daily submissions bar chart ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]"
        >
          <SectionHeader>Daily submissions</SectionHeader>
          <div className="p-6">
            {isLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : daily.length === 0 ? (
              <EmptyChart message="No submissions for this period." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -16 }} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<BrutalistTooltip />} />
                  <Bar dataKey="submissions" name="Submissions" fill={C.green} stroke="#0A0A0A" strokeWidth={1} radius={0} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* ── Referrers + Countries row ─────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* Top referrers */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]"
          >
            <SectionHeader>Top referrers</SectionHeader>
            <div className="p-5">
              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : referrers.length === 0 ? (
                <EmptyChart message="No referrer data." />
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(referrers.length * 36, 120)}>
                  <BarChart
                    layout="vertical"
                    data={referrers}
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                    barSize={14}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<BrutalistTooltip />} />
                    <Bar dataKey="count" name="Visits" fill={C.blue} stroke="#0A0A0A" strokeWidth={1} radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Top countries */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]"
          >
            <SectionHeader>Top countries</SectionHeader>
            <div className="p-5">
              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : countries.length === 0 ? (
                <EmptyChart message="No country data — IP geolocation not configured." />
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(countries.length * 36, 120)}>
                  <BarChart
                    layout="vertical"
                    data={countries}
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                    barSize={14}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="country" width={60} tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<BrutalistTooltip />} />
                    <Bar dataKey="count" name="Views" fill={C.purple} stroke="#0A0A0A" strokeWidth={1} radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Response over time (line) ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]"
        >
          <SectionHeader>Views vs Starts vs Submissions — comparison</SectionHeader>
          <div className="p-6">
            {isLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : daily.length === 0 ? (
              <EmptyChart message="No data for this period." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<BrutalistTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }} />
                  <Line type="monotone" dataKey="views"       name="Views"       stroke={C.blue}   strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5, stroke: "#0A0A0A", fill: C.blue }}   activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="starts"      name="Starts"      stroke={C.yellow} strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5, stroke: "#0A0A0A", fill: C.yellow }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="submissions" name="Submissions" stroke={C.green}  strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5, stroke: "#0A0A0A", fill: C.green }}  activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* ── Summary stats footer ─────────────────────────────── */}
        {!isLoading && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]"
          >
            <SectionHeader>Summary</SectionHeader>
            <div className="grid grid-cols-2 gap-0 divide-x-2 divide-[var(--border-muted)] sm:grid-cols-4">
              {[
                { label: "Total events tracked", value: (views + starts + submissions + abandons).toLocaleString() },
                { label: "Views → submissions",  value: `${pct(submissions, views)}%` },
                { label: "Unique visitor ratio",  value: views ? `${pct(uniqueViews, views)}%` : "—" },
                { label: "Avg completion time",   value: avgMin ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} className="px-6 py-4">
                  <p className="font-display text-2xl font-black">{value}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-40 items-center justify-center border-2 border-dashed border-[var(--border-muted)]">
      <p className="font-mono text-xs text-[var(--text-muted)]">{message}</p>
    </div>
  );
}
