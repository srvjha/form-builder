"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface StatMetricProps {
  label:      string;
  value:      number | string;
  trend?:     number;   // percentage change, positive = up
  trendLabel?: string;
  prefix?:    string;
  suffix?:    string;
  className?: string;
  /** Kept for API compatibility; stats no longer animate in. */
  delay?:     number;
}

export function StatMetric({
  label,
  value,
  trend,
  trendLabel,
  prefix,
  suffix,
  className,
}: StatMetricProps) {
  const trendDir = trend === undefined ? null : trend > 0 ? "up" : trend < 0 ? "down" : "flat";

  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-5",
        className,
      )}
    >
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1.5 font-sans text-[28px] font-semibold leading-tight tabular-nums tracking-tight text-[var(--text-primary)]">
        {prefix}
        {typeof value === "number" ? formatNumber(value) : value}
        {suffix}
      </p>
      {trendDir && (
        <div className="mt-2 flex items-center gap-1.5">
          {trendDir === "up" && <TrendingUp className="h-3.5 w-3.5 text-[var(--color-green)]" aria-hidden />}
          {trendDir === "down" && <TrendingDown className="h-3.5 w-3.5 text-[var(--color-red)]" aria-hidden />}
          {trendDir === "flat" && <Minus className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden />}
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              trendDir === "up"   && "text-[var(--color-green)]",
              trendDir === "down" && "text-[var(--color-red)]",
              trendDir === "flat" && "text-[var(--text-muted)]",
            )}
          >
            {trend !== undefined && `${Math.abs(trend)}%`}
          </span>
          {trendLabel && <span className="text-xs text-[var(--text-muted)]">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
