import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-page)] px-4 sm:px-6">
      <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-10 text-center shadow-soft-md">
        <p aria-hidden className="select-none font-display text-7xl font-bold tracking-tight text-[var(--border-muted)]">
          404
        </p>
        <Zap className="mx-auto mt-2 mb-4 h-8 w-8 text-[var(--color-accent)]" />
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          The page you are looking for does not exist or has moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-soft-xs transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-soft-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-5 text-sm font-semibold text-[var(--text-primary)] shadow-soft-xs transition-colors hover:bg-[var(--bg-inset)]"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
