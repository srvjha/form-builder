import Link from "next/link";
import { cn } from "@/lib/utils";
import { TooltipBox, TooltipRow } from "./chart-tooltip";

export interface BarItem {
  id: string;
  label: string;
  value: number;
  /* direct label shown at the row's end, e.g. "1,204 · 38%" */
  valueLabel?: string;
  href?: string;
  /* extra rows shown on hover / focus */
  details?: { label: string; value: string }[];
}

/* Horizontal bars, one hue, each one labelled directly. Bars share a single
   baseline on the left; the data end is rounded 4px, the baseline is square. */
export function HorizontalBarList({
  items,
  max,
  ariaLabel,
  className,
}: {
  items: BarItem[];
  /* the value that maps to a full-width bar (defaults to the largest value) */
  max?: number;
  ariaLabel: string;
  className?: string;
}) {
  const top = max ?? Math.max(0, ...items.map((i) => i.value));

  return (
    <ul aria-label={ariaLabel} className={cn("space-y-0.5", className)}>
      {items.map((item) => {
        const width = top > 0 ? (item.value / top) * 100 : 0;
        const content = (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-sm text-[var(--text-primary)]" title={item.label}>
                {item.label}
              </span>
              <span className="shrink-0 whitespace-nowrap text-[13px] tabular-nums text-[var(--text-secondary)]">
                {item.valueLabel ?? item.value.toLocaleString()}
              </span>
            </div>
            <div className="mt-1.5 h-3" aria-hidden>
              {item.value > 0 && (
                <div
                  className="h-full rounded-r-[4px] bg-[var(--color-accent)] transition-[width] duration-300 ease-out group-hover:opacity-80"
                  style={{ width: `max(2px, ${width}%)` }}
                />
              )}
            </div>
            {item.details && item.details.length > 0 && (
              <TooltipBox className="absolute bottom-full left-2 z-20 mb-1 hidden group-hover:block group-focus-visible:block group-focus-within:block">
                <p className="mb-1 max-w-[220px] truncate text-xs text-[var(--text-muted)]">{item.label}</p>
                {item.details.map((d) => (
                  <TooltipRow key={d.label} label={d.label} value={d.value} />
                ))}
              </TooltipBox>
            )}
          </>
        );

        const rowClass =
          "group relative block rounded-md px-2 py-2 transition-colors hover:bg-[var(--bg-inset)]";

        return (
          <li key={item.id}>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  rowClass,
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                )}
              >
                {content}
              </Link>
            ) : (
              <div className={rowClass} tabIndex={item.details ? 0 : undefined}>
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
