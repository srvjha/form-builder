import Link from "next/link";
import { Zap } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] bg-dot-grid flex flex-col">
      {/* Minimal header */}
      <header className="border-b-2 border-[#0A0A0A] px-6 h-14 flex items-center">
        <Link href={ROUTES.home} className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center bg-[var(--color-accent)] border-2 border-[#0A0A0A]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-sm font-extrabold uppercase tracking-widest">
            {APP_NAME}
          </span>
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      <footer className="border-t-2 border-[#0A0A0A] px-6 py-4 text-center">
        <p className="font-mono text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} {APP_NAME}. Built with ♥ and no rounded corners.
        </p>
      </footer>
    </div>
  );
}
