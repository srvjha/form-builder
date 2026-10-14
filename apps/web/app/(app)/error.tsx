"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-8 text-center shadow-soft-md">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
          <AlertTriangle className="h-5 w-5 text-[var(--color-accent)]" />
        </div>
        <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          Something went wrong
        </h2>
        <p className="mt-2 break-words text-xs leading-relaxed text-[var(--text-muted)]">
          {error.message ?? "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">{error.digest}</p>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-soft-xs transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-soft-accent"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Try again
          </button>
          <Link
            href={ROUTES.dashboard}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-4 text-sm font-semibold text-[var(--text-primary)] shadow-soft-xs transition-colors hover:bg-[var(--bg-inset)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
