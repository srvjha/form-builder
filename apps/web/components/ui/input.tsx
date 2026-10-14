import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftSlot?:  React.ReactNode;
  rightSlot?: React.ReactNode;
  error?:     boolean;
}

const fieldClasses = (error?: boolean) =>
  cn(
    "h-10 w-full rounded-md border bg-[var(--bg-panel)] px-3 py-2",
    "font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
    "transition-[border-color,box-shadow] duration-150",
    "focus:outline-none focus:border-[var(--color-accent)] focus:ring-[3px] focus:ring-[var(--color-accent)]/25",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--bg-inset)]",
    error
      ? "border-[var(--color-red)] focus:border-[var(--color-red)] focus:ring-[var(--color-red)]/20"
      : "border-[var(--border-color)] hover:border-[var(--text-muted)]/40",
  );

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftSlot, rightSlot, error, ...props }, ref) => {
    if (leftSlot || rightSlot) {
      return (
        <div className={cn("relative flex items-center", className)}>
          {leftSlot && (
            <div className="pointer-events-none absolute left-3 flex items-center text-[var(--text-muted)]">
              {leftSlot}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            aria-invalid={error || undefined}
            className={cn(fieldClasses(error), leftSlot && "pl-9", rightSlot && "pr-9")}
            {...props}
          />
          {rightSlot && (
            <div className="absolute right-3 flex items-center text-[var(--text-muted)]">
              {rightSlot}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(fieldClasses(error), className)}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
