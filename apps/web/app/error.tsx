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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-page)] bg-dot-grid px-6">
      <div className="w-full max-w-md border-4 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[8px_8px_0_#0A0A0A]">
        {/* Error accent stripe */}
        <div className="h-2 w-full bg-[#FF3B00]" />

        <div className="p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-2 border-[#FF3B00] bg-[#FF3B00]/10">
            <AlertTriangle className="h-7 w-7 text-[#FF3B00]" />
          </div>

          <h1 className="font-display text-2xl font-black uppercase tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            An unexpected error occurred. The issue has been logged.
          </p>

          {error.digest && (
            <p className="mt-2 font-mono text-[10px] text-[var(--text-muted)] opacity-60">
              Error ID: {error.digest}
            </p>
          )}

          <button
            onClick={reset}
            className="mt-8 inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FF3B00] px-5 py-2.5 font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-[3px_3px_0_#0A0A0A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#0A0A0A]"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
