"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChartTooltip } from "./chart-tooltip";
import { ChartEmpty, ChartPanel } from "./panel";
import { SegmentedControl } from "./segmented-control";
import { AXIS_TICK, CHART_COLOR, GRID_COLOR, formatDay } from "./utils";

export interface TimeSeriesMetric<K extends string> {
  key: K;
  label: string;
  /* lower-case noun used in the summary line, e.g. "views" */
  noun: string;
}

type Row<K extends string> = { date: string } & Record<K, number>;

/* One series at a time; a metric switch above the plot picks which */
export function TimeSeriesCard<K extends string>({
  title,
  data,
  metrics,
  days,
  loading,
  emptyMessage,
  emptyAction,
  height = 260,
}: {
  title: string;
  data: Row<K>[];
  metrics: readonly TimeSeriesMetric<K>[];
  days: number;
  loading?: boolean;
  emptyMessage: string;
  emptyAction?: React.ReactNode;
  height?: number;
}) {
  const [metricKey, setMetricKey] = useState<K>(metrics[0]!.key);
  const metric = metrics.find((m) => m.key === metricKey) ?? metrics[0]!;
  const total = data.reduce((acc, row) => acc + (row[metric.key] ?? 0), 0);
  const hasAny = data.some((row) => metrics.some((m) => (row[m.key] ?? 0) > 0));

  return (
    <ChartPanel
      title={title}
      description={
        loading || !hasAny
          ? undefined
          : `${total.toLocaleString()} ${metric.noun} in the last ${days} days`
      }
      action={
        hasAny && !loading ? (
          <SegmentedControl
            label="Metric"
            options={metrics.map((m) => ({ value: m.key, label: m.label }))}
            value={metric.key}
            onChange={setMetricKey}
          />
        ) : undefined
      }
    >
      <div className="px-2 pb-4 pt-4 sm:px-4 sm:pb-5">
        {loading ? (
          <div className="px-2"><Skeleton className="w-full" style={{ height }} /></div>
        ) : !hasAny ? (
          <div className="px-2"><ChartEmpty message={emptyMessage} action={emptyAction} /></div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={GRID_COLOR} vertical={false} />
              <XAxis
                dataKey="date"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                tickMargin={8}
                tickFormatter={(d: string) => formatDay(d)}
              />
              <YAxis
                allowDecimals={false}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                cursor={{ stroke: "var(--border-color)", strokeWidth: 1 }}
                content={<ChartTooltip seriesLabel={metric.label} formatLabel={(d) => formatDay(d, "EEE, MMM d")} />}
              />
              <Area
                type="monotone"
                dataKey={metric.key}
                name={metric.label}
                stroke={CHART_COLOR}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={CHART_COLOR}
                fillOpacity={0.15}
                dot={false}
                activeDot={{ r: 4, fill: CHART_COLOR, stroke: "var(--bg-panel)", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartPanel>
  );
}

/* A small, self-scaled area chart for small multiples */
export function SmallAreaChart<K extends string>({
  title,
  data,
  dataKey,
  total,
  totalLabel,
  loading,
  height = 112,
  className,
}: {
  title: string;
  data: Row<K>[];
  dataKey: K;
  total?: number;
  totalLabel?: string;
  loading?: boolean;
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 px-4 py-4 sm:px-5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="truncate text-[13px] font-medium text-[var(--text-primary)]">{title}</h4>
        {!loading && total != null && (
          <span className="whitespace-nowrap text-[13px] tabular-nums text-[var(--text-secondary)]">
            {total.toLocaleString()}
            {totalLabel && <span className="text-[var(--text-muted)]"> {totalLabel}</span>}
          </span>
        )}
      </div>
      <div className="mt-3">
        {loading ? (
          <Skeleton className="w-full" style={{ height: height + 24 }} />
        ) : (
          <ResponsiveContainer width="100%" height={height + 24}>
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={GRID_COLOR} vertical={false} />
              <XAxis
                dataKey="date"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                minTickGap={40}
                tickMargin={6}
                tickFormatter={(d: string) => formatDay(d)}
              />
              <YAxis
                allowDecimals={false}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                width={32}
                tickCount={3}
              />
              <Tooltip
                cursor={{ stroke: "var(--border-color)", strokeWidth: 1 }}
                content={<ChartTooltip seriesLabel={title} formatLabel={(d) => formatDay(d, "EEE, MMM d")} />}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                name={title}
                stroke={CHART_COLOR}
                strokeWidth={2}
                fill={CHART_COLOR}
                fillOpacity={0.15}
                dot={false}
                activeDot={{ r: 4, fill: CHART_COLOR, stroke: "var(--bg-panel)", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
