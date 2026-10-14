import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface KpiItem {
  label: string;
  value: string;
  sub?: string;
}

/* One panel holding a row of numbers, split by hairlines */
export function KpiRow({
  items,
  loading,
  count,
  className,
}: {
  items: KpiItem[];
  loading?: boolean;
  /* how many cells to show while loading */
  count?: number;
  className?: string;
}) {
  const n = loading ? (count ?? 5) : items.length;
  const cols =
    n >= 5 ? "lg:grid-cols-5" : n === 4 ? "lg:grid-cols-4" : n === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]",
        className,
      )}
    >
      <dl
        className={cn(
          // Each cell draws its right and bottom hairline; the panel clips the outer ones
          "-mb-px -mr-px grid grid-cols-2 sm:grid-cols-3 [&>*]:border-b [&>*]:border-r [&>*]:border-[var(--border-muted)]",
          cols,
        )}
      >
        {loading
          ? Array.from({ length: n }).map((_, i) => (
              <div key={i} className="space-y-2 px-4 py-4 sm:px-6 sm:py-5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-7 w-16" />
              </div>
            ))
          : items.map((item) => (
              <div key={item.label} className="min-w-0 px-4 py-4 sm:px-6 sm:py-5">
                <dt className="truncate text-[13px] text-[var(--text-secondary)]">{item.label}</dt>
                <dd className="mt-1 text-[26px] font-semibold leading-tight tabular-nums text-[var(--text-primary)]">
                  {item.value}
                </dd>
                {item.sub && (
                  <dd className="mt-1 text-xs tabular-nums text-[var(--text-muted)]">{item.sub}</dd>
                )}
              </div>
            ))}
      </dl>
    </section>
  );
}
