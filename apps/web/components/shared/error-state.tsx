"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?:       string;
  description?: string;
  code?:        string;
  onRetry?:     () => void;
  className?:   string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  code,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-6 shadow-soft-sm",
        className,
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bg-inset)]">
        <AlertTriangle className="h-5 w-5 text-[var(--color-red)]" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">{description}</p>
        {code && (
          <span className="mt-3 inline-block rounded-md border border-[var(--border-muted)] bg-[var(--bg-inset)] px-2 py-1 font-mono text-xs text-[var(--text-muted)]">
            {code}
          </span>
        )}
        {onRetry && (
          <div className="mt-4">
            <Button size="sm" onClick={onRetry}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
