"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-page)] px-4 sm:px-6">
      <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-10 text-center shadow-soft-md">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
          <AlertTriangle className="h-7 w-7 text-[var(--color-accent)]" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          An unexpected error occurred. It has been logged.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-[10px] text-[var(--text-muted)]">
            Error ID: {error.digest}
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-soft-xs transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-soft-accent"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    </div>
  );
}
