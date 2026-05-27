"use client";

import { useParams } from "next/navigation";
import { motion }    from "framer-motion";
import { Eye, MousePointerClick, Send, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { StatMetric } from "@/components/shared/stat-metric";
import { Skeleton }   from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Progress }   from "@/components/ui/progress";
import { trpc }       from "@/lib/trpc";

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.3 } }),
};

function fmt(n: number | null | undefined, suffix = "") {
  if (n == null) return "—";
  return `${n.toLocaleString()}${suffix}`;
}

export default function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error, refetch } = trpc.forms.analytics.useQuery(
    { formId: id },
    { enabled: !!id },
  );

  if (error)     return <div className="p-6"><ErrorState description={error.message} onRetry={refetch} /></div>;

  const views       = data?.views       ?? 0;
  const starts      = data?.starts      ?? 0;
  const submissions = data?.submissions ?? 0;
  const startRate   = views > 0   ? Math.round((starts      / views)  * 100) : 0;
  const completion  = starts > 0  ? Math.round((submissions / starts) * 100) : 0;
  const avgMs       = data?.avgCompletionMs;
  const avgSec      = avgMs ? Math.round(avgMs / 1000) : null;

  const METRICS = [
    { label: "Total Views",      value: fmt(views),       delay: 0,    icon: Eye },
    { label: "Started",          value: fmt(starts),      delay: 0.05, icon: MousePointerClick },
    { label: "Submitted",        value: fmt(submissions), delay: 0.1,  icon: Send },
    { label: "Avg. Time",        value: avgSec ? `${avgSec}s` : "—", delay: 0.15, icon: Clock },
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
            : METRICS.map(({ label, value, delay }) => (
                <StatMetric key={label} label={label} value={value} delay={delay} />
              ))}
        </div>

        {/* Funnel */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
          className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md"
        >
          <div className="border-b-2 border-[#0A0A0A] px-6 py-4">
            <p className="label-overline">Conversion funnel</p>
          </div>
          <div className="space-y-6 p-6">
            {[
              { label: "Viewed form",  count: views,       pct: 100,       color: "#FF3B00" },
              { label: "Started",      count: starts,      pct: startRate, color: "#FFD600" },
              { label: "Submitted",    count: submissions, pct: completion, color: "#00C853" },
            ].map(({ label, count, pct, color }) => (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-extrabold uppercase tracking-wide">{label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[var(--text-muted)]">{count.toLocaleString()}</span>
                    <span
                      className="w-14 text-right font-display text-sm font-extrabold"
                      style={{ color }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-3 w-full border-2 border-[#0A0A0A] bg-[var(--bg-inset)]">
                  <div
                    className="h-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Completion rate big number */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
          className="grid gap-4 sm:grid-cols-2"
        >
          {[
            {
              label: "Start rate",
              value: `${startRate}%`,
              sub:   "of viewers started filling",
              good:  startRate >= 40,
            },
            {
              label: "Completion rate",
              value: `${completion}%`,
              sub:   "of starters submitted",
              good:  completion >= 60,
            },
          ].map(({ label, value, sub, good }) => (
            <div key={label} className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] p-6 shadow-brut-md">
              <div className="flex items-start justify-between">
                <p className="label-overline">{label}</p>
                {good
                  ? <TrendingUp className="h-4 w-4 text-[var(--color-green)]" />
                  : <TrendingDown className="h-4 w-4 text-[var(--color-red)]" />}
              </div>
              <p className="mt-3 font-display text-5xl font-black tracking-tight" style={{ color: good ? "var(--color-green)" : "var(--color-red)" }}>
                {value}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Per-event breakdown */}
        {data && (
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}
            className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md"
          >
            <div className="border-b-2 border-[#0A0A0A] px-6 py-4">
              <p className="label-overline">Event breakdown</p>
            </div>
            <div className="divide-y-2 divide-[var(--border-muted)]">
              {[
                { event: "view",     label: "Views",    count: views },
                { event: "start",    label: "Starts",   count: starts },
                { event: "submit",   label: "Submits",  count: submissions },
                { event: "abandon",  label: "Abandons", count: data?.abandons ?? 0 },
              ].map(({ label, count }) => (
                <div key={label} className="flex items-center gap-4 px-6 py-3">
                  <span className="w-24 font-display text-xs font-extrabold uppercase tracking-wide">{label}</span>
                  <div className="flex-1">
                    <Progress value={views > 0 ? (count / views) * 100 : 0} className="h-2" />
                  </div>
                  <span className="w-16 text-right font-mono text-xs tabular-nums">{count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
