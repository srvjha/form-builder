"use client";

import { motion } from "framer-motion";
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
  delay = 0,
}: StatMetricProps) {
  const trendDir = trend === undefined ? null : trend > 0 ? "up" : trend < 0 ? "down" : "flat";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-5 shadow-soft-sm",
        className,
      )}
    >
      <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>
      <p className="font-display mt-2 text-3xl font-bold tabular-nums tracking-tight text-[var(--text-primary)]">
        {prefix}
        {typeof value === "number" ? formatNumber(value) : value}
        {suffix}
      </p>
      {trendDir && (
        <div className="mt-2 flex items-center gap-1.5">
          {trendDir === "up" && <TrendingUp className="h-3.5 w-3.5 text-[var(--color-green)]" />}
          {trendDir === "down" && <TrendingDown className="h-3.5 w-3.5 text-[var(--color-red)]" />}
          {trendDir === "flat" && <Minus className="h-3.5 w-3.5 text-[var(--text-muted)]" />}
          <span
            className={cn(
              "text-xs font-medium",
              trendDir === "up"   && "text-[var(--color-green)]",
              trendDir === "down" && "text-[var(--color-red)]",
              trendDir === "flat" && "text-[var(--text-muted)]",
            )}
          >
            {trend !== undefined && `${Math.abs(trend)}%`}
            {trendLabel && ` ${trendLabel}`}
          </span>
        </div>
      )}
    </motion.div>
  );
}
