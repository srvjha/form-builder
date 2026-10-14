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
          className={cn(
            "w-full min-h-[120px] rounded-md border bg-[var(--bg-panel)] px-3 py-2",
            "text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            "resize-y transition-[border-color,box-shadow] duration-150",
            "focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-[var(--color-red)] focus:ring-[var(--color-red)]/30"
              : "border-[var(--border-color)]",
            showCount && "pb-7",
            className,
          )}
          {...props}
        />
        {showCount && maxLength && (
          <span className="absolute bottom-2 right-3 text-[11px] font-mono text-[var(--text-muted)] pointer-events-none">
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
