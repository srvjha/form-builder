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
      className={cn(
        "border-2 border-[var(--border-color)] bg-[var(--bg-panel)] p-8",
        "border-l-4 border-l-[var(--color-red)]",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[var(--color-red)] bg-[var(--bg-inset)]">
          <AlertTriangle className="h-5 w-5 text-[var(--color-red)]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-extrabold uppercase tracking-wide text-[var(--text-primary)]">
            ✖ {title}
          </h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p>
          {code && (
            <span className="mt-3 inline-block bg-[var(--bg-inset)] border border-[var(--border-muted)] px-2 py-1 font-mono text-xs text-[var(--text-muted)]">
              {code}
            </span>
          )}
          {onRetry && (
            <div className="mt-5 flex gap-3">
              <Button size="sm" onClick={onRetry}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
