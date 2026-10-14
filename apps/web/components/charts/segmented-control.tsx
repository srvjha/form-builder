"use client";

import { cn } from "@/lib/utils";

export interface SegmentOption<V extends string> {
  value: V;
  label: string;
}

export function SegmentedControl<V extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly SegmentOption<V>[];
  value: V;
  onChange: (value: V) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex max-w-full overflow-x-auto rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] p-0.5",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "whitespace-nowrap rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
              active
                ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
