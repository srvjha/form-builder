"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

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
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
      <h2 className="font-display text-3xl text-[var(--text-primary)] sm:text-4xl">
        This page failed to load
      </h2>
      <p className="mt-3 max-w-sm break-words text-sm leading-relaxed text-[var(--text-secondary)]">
        {error.message || "An unexpected error stopped this page from loading."}
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          Error ID <code className="font-mono">{error.digest}</code>
        </p>
      )}
      <Button type="button" onClick={reset} className="mt-7">
        <RefreshCcw className="h-4 w-4" aria-hidden />
        Try again
      </Button>
      <Link
        href={ROUTES.dashboard}
        className="mt-4 text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
