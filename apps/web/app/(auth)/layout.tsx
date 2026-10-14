import Link from "next/link";
import { APP_NAME, ROUTES } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] bg-dot-grid">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <Link
          href={ROUTES.home}
          className="mb-8 rounded-md font-display text-[40px] leading-none tracking-[-0.02em] text-[var(--text-primary)]"
        >
          {APP_NAME}
        </Link>
        <div className="w-full max-w-[400px]">{children}</div>
      </main>

      <footer className="px-4 py-4 text-center sm:px-6">
        <p className="text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} {APP_NAME}
        </p>
      </footer>
    </div>
  );
}
