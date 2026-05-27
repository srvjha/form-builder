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
              "h-11 w-full border-2 bg-[var(--bg-inset)] px-3 py-2",
              "text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "transition-all duration-100",
              "focus:border-[var(--color-accent)] focus:shadow-[3px_3px_0px_var(--color-accent)] focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-[var(--color-red)] shadow-[3px_3px_0px_var(--color-red)]"
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
          "h-11 w-full border-2 bg-[var(--bg-inset)] px-3 py-2",
          "text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
          "transition-all duration-100",
          "focus:border-[var(--color-accent)] focus:shadow-[3px_3px_0px_var(--color-accent)] focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-[var(--color-red)] shadow-[3px_3px_0px_var(--color-red)]"
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
