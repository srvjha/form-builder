import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, showCount, maxLength, value, ...props }, ref) => {
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="relative">
        <textarea
          ref={ref}
          maxLength={maxLength}
          value={value}
          aria-invalid={error || undefined}
          className={cn(
            "w-full min-h-[120px] rounded-md border bg-[var(--bg-panel)] px-3 py-2.5",
            "font-sans text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            "resize-y transition-[border-color,box-shadow] duration-150",
            "focus:outline-none focus:border-[var(--color-accent)] focus:ring-[3px] focus:ring-[var(--color-accent)]/25",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--bg-inset)]",
            error
              ? "border-[var(--color-red)] focus:border-[var(--color-red)] focus:ring-[var(--color-red)]/20"
              : "border-[var(--border-color)] hover:border-[var(--text-muted)]/40",
            showCount && "pb-7",
            className,
          )}
          {...props}
        />
        {showCount && maxLength && (
          <span className="pointer-events-none absolute bottom-2 right-3 text-xs tabular-nums text-[var(--text-muted)]">
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
