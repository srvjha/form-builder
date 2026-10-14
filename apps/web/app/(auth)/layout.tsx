import Link from "next/link";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] bg-dot-grid">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <Link
          href={ROUTES.home}
          aria-label={APP_NAME}
          className="mb-8 rounded-md"
        >
          <Logo markClassName="h-10 w-10" textClassName="text-[36px]" />
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
