"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <h1 className="font-display text-4xl text-[var(--text-primary)] sm:text-5xl">
        This page failed to load
      </h1>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--text-secondary)]">
        The error has been logged. Try loading the page again.
      </p>
      {error.digest && (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Error ID <code className="font-mono">{error.digest}</code>
        </p>
      )}
      <Button type="button" onClick={reset} className="mt-8">
        <RefreshCcw className="h-4 w-4" aria-hidden />
        Try again
      </Button>
    </main>
  );
}
