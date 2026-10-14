"use client";

import { AlertCircle } from "lucide-react";
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
  title = "This didn't load",
  description = "Check your connection, then try again.",
  code,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-5",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-red)]" aria-hidden />
      <div className="min-w-0 flex-1">
        <h3 className="font-sans text-[15px] font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
        {code && (
          <code className="mt-3 inline-block break-all rounded-md bg-[var(--bg-inset)] px-2 py-1 font-mono text-xs text-[var(--text-muted)]">
            {code}
          </code>
        )}
        {onRetry && (
          <div className="mt-4">
            <Button size="sm" variant="secondary" onClick={onRetry}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
