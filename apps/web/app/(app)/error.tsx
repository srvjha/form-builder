"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";
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
    <div className="flex h-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md">
        <div className="h-1.5 w-full bg-[#FF3B00]" />
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center border-2 border-[#FF3B00] bg-[#FF3B00]/10">
            <AlertTriangle className="h-5 w-5 text-[#FF3B00]" />
          </div>
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight">
            Something went wrong
          </h2>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            {error.message ?? "An unexpected error occurred."}
          </p>
          {error.digest && (
            <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)] opacity-50">
              {error.digest}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={reset}
              className="flex w-full items-center justify-center gap-2 border-2 border-[#0A0A0A] bg-[#FF3B00] px-4 py-2 font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-[2px_2px_0_#0A0A0A] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              <RefreshCcw className="h-3.5 w-3.5" /> Try again
            </button>
            <Link
              href={ROUTES.dashboard}
              className="flex w-full items-center justify-center gap-2 border-2 border-[#0A0A0A] bg-[var(--bg-panel)] px-4 py-2 font-display text-xs font-extrabold uppercase tracking-wider shadow-[2px_2px_0_#0A0A0A] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
