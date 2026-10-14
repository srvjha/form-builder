import Link from "next/link";
import { Zap } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] bg-dot-grid flex flex-col">
      <header className="px-4 sm:px-6 h-14 flex items-center">
        <Link href={ROUTES.home} className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-accent)] shadow-soft-accent">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            {APP_NAME}
          </span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-6 sm:p-8 shadow-soft-sm">
          {children}
        </div>
      </main>

      <footer className="px-4 sm:px-6 py-4 text-center">
        <p className="text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} {APP_NAME}
        </p>
      </footer>
    </div>
  );
}
