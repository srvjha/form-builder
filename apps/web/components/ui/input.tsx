import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftSlot?:  React.ReactNode;
  rightSlot?: React.ReactNode;
  error?:     boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftSlot, rightSlot, error, ...props }, ref) => {
    if (leftSlot || rightSlot) {
      return (
        <div className={cn("relative flex items-center", className)}>
          {leftSlot && (
            <div className="absolute left-3 flex items-center text-[var(--text-muted)] pointer-events-none">
              {leftSlot}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "h-11 w-full border bg-[var(--bg-inset)] px-3 py-2",
              "text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "transition-[border-color,box-shadow] duration-150",
              "focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-[var(--color-red)] focus:ring-[var(--color-red)]/30"
                : "border-[var(--border-color)]",
              leftSlot  && "pl-9",
              rightSlot && "pr-9",
            )}
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
        className={cn(
          "h-11 w-full border bg-[var(--bg-inset)] px-3 py-2",
          "text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
          "transition-[border-color,box-shadow] duration-150",
          "focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-[var(--color-red)] focus:ring-[var(--color-red)]/30"
            : "border-[var(--border-color)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
