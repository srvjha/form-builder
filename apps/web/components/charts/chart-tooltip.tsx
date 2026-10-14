import { cn } from "@/lib/utils";

/* A floating readout (the one place a shadow is allowed). Value leads, label follows. */
export function TooltipBox({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "pointer-events-none min-w-[140px] rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-3 py-2 shadow-soft-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TooltipRow({ label, value, keyed }: { label: string; value: string; keyed?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <span className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
        {keyed && <span aria-hidden className="h-0.5 w-3 rounded-full bg-[var(--color-accent)]" />}
        {label}
      </span>
      <span className="text-[13px] font-semibold tabular-nums text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

/* Recharts tooltip content for a single-series chart */
export function ChartTooltip({
  active,
  payload,
  label,
  seriesLabel,
  formatLabel,
}: {
  active?: boolean;
  // Recharts passes a loosely typed payload; only `value` is read here
  payload?: ReadonlyArray<{ value?: unknown }>;
  label?: unknown;
  seriesLabel: string;
  formatLabel?: (label: string) => string;
}) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value ?? 0);
  const title = label == null ? null : formatLabel ? formatLabel(String(label)) : String(label);
  return (
    <TooltipBox>
      {title && <p className="mb-1 text-xs text-[var(--text-muted)]">{title}</p>}
      <TooltipRow label={seriesLabel} value={value.toLocaleString()} keyed />
    </TooltipBox>
  );
}
