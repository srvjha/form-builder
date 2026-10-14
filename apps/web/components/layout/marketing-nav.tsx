"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { ROUTES, APP_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Features",     href: "/#features"       },
  { label: "How it works", href: "/#how-it-works"   },
  { label: "Explore",      href: ROUTES.explore    },
];

export function MarketingNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  /* Transparent over the hero; gains a blurred panel once the page scrolls */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-[var(--border-muted)] bg-[var(--bg-page)]/75 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href={ROUTES.home} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-gradient shadow-soft-xs">
            <Zap className="h-4 w-4 fill-[var(--color-highlight)] text-[var(--color-highlight)]" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors duration-150",
                pathname === href
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isLoaded &&
            (isSignedIn ? (
              <>
                <Link
                  href={ROUTES.dashboard}
                  className="hidden rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-3.5 py-1.5 text-sm font-medium text-[var(--text-primary)] shadow-soft-xs transition-colors hover:bg-[var(--bg-inset)] sm:inline-flex"
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: { avatarBox: "h-8 w-8 rounded-full" },
                  }}
                />
              </>
            ) : (
              <>
                <SignInButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
                  <button
                    type="button"
                    className="hidden rounded-md px-3.5 py-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)] sm:inline-flex"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-3.5 py-1.5 text-sm font-semibold text-white shadow-soft-xs transition-all duration-150 hover:bg-[var(--color-accent-hover)] hover:shadow-soft-accent"
                  >
                    Start free
                  </button>
                </SignUpButton>
              </>
            ))}
        </div>
      </div>
    </header>
  );
}
