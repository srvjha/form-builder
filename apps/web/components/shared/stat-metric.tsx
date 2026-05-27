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
        "border-2 border-[var(--border-color)] bg-[var(--bg-panel)] p-6",
        "shadow-brut-md",
        className,
      )}
    >
      <p className="label-overline mb-3">{label}</p>
      <p className="font-display text-4xl font-black tabular-nums tracking-tight text-[var(--text-primary)]">
        {prefix}
        {typeof value === "number" ? formatNumber(value) : value}
        {suffix}
      </p>
      {trendDir && (
        <div className="mt-3 flex items-center gap-1.5">
          {trendDir === "up" && <TrendingUp className="h-3.5 w-3.5 text-[var(--color-green)]" />}
          {trendDir === "down" && <TrendingDown className="h-3.5 w-3.5 text-[var(--color-red)]" />}
          {trendDir === "flat" && <Minus className="h-3.5 w-3.5 text-[var(--text-muted)]" />}
          <span
            className={cn(
              "text-xs font-bold",
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
