"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ROUTES, APP_NAME } from "@/lib/constants";
import { Logo } from "@/components/shared/logo";

const NAV_LINKS = [
  { label: "Features",     href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Explore",      href: ROUTES.explore },
];

const linkCls =
  "text-[16px] text-[var(--text-primary)] underline decoration-transparent decoration-[0.07em] underline-offset-[0.25em] transition-[text-decoration-color] hover:decoration-current";

/* A plain bar over the dotted ground: wordmark, three links, one action */
export function MarketingNav() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link href={ROUTES.home} aria-label={APP_NAME} className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className={linkCls}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isLoaded &&
            (isSignedIn ? (
              <>
                <Link href={ROUTES.dashboard} className={`hidden sm:inline ${linkCls}`}>
                  Dashboard
                </Link>
                <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 rounded-full" } }} />
              </>
            ) : (
              <>
                <SignInButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
                  <button type="button" className={`hidden sm:inline ${linkCls}`}>
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
                  <button
                    type="button"
                    className="inline-flex min-h-[40px] items-center rounded-full bg-[var(--color-action)] px-5 text-[16px] font-medium text-white transition-[transform,background-color] hover:bg-[var(--color-action-hover)] active:scale-[0.97]"
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
