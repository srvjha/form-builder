"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { ROUTES, APP_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Features",   href: "/#features"      },
  { label: "Explore",    href: ROUTES.explore     },
  { label: "The Crew",   href: ROUTES.characters  },
  { label: "About",      href: ROUTES.about       },
];

export function MarketingNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();

  return (
    <header className={cn(
      "sticky top-0 z-[var(--z-sticky)]",
      "flex h-14 items-center justify-between px-6",
      "border-b-2 border-[var(--border-color)] bg-[var(--bg-page)]",
    )}>
      {/* Logo */}
      <Link href={ROUTES.home} className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center bg-[var(--color-accent)] border-2 border-[var(--border-color)] shadow-brut-xs">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="font-display text-sm font-extrabold uppercase tracking-widest">
          {APP_NAME}
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden items-center gap-6 md:flex">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-xs font-bold uppercase tracking-wider transition-colors duration-100",
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

        {isLoaded && (
          isSignedIn ? (
            <>
              <Button variant="secondary" size="sm" asChild>
                <Link href={ROUTES.dashboard}>Dashboard</Link>
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 rounded-none border-2 border-[var(--border-color)]",
                  },
                }}
              />
            </>
          ) : (
            <>
              <SignInButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
                <Button variant="primary" size="sm" className="gap-1.5">
                  Start Free
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </SignUpButton>
            </>
          )
        )}
      </div>
    </header>
  );
}
