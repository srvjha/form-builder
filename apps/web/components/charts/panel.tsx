import { cn } from "@/lib/utils";

/* A solid surface on the dot ground. Title is a small sans heading. */
export function ChartPanel({
  title,
  description,
  action,
  className,
  children,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]",
        className,
      )}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 px-4 pt-4 sm:px-6 sm:pt-5">
          <div className="min-w-0">
            {title && <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">{title}</h3>}
            {description && <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/* Shown instead of empty axes: a plain message with a next action */
export function ChartEmpty({
  message,
  action,
  className,
}: {
  message: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-md bg-[var(--bg-inset)] px-4 py-8 text-center",
        className,
      )}
    >
      <p className="max-w-sm text-sm text-[var(--text-secondary)]">{message}</p>
      {action}
    </div>
  );
}
