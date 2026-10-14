import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-medium tabular-nums text-[var(--text-muted)]">404</p>
      <h1 className="mt-3 font-display text-4xl text-[var(--text-primary)] sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--text-secondary)]">
        This link is broken or the page has moved. Check the address, or start again from the home page.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go to home page</Link>
      </Button>
    </main>
  );
}
