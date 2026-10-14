"use client";

import { Menu, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useUIStore } from "@/stores/ui-store";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

interface TopbarProps {
  title?:   string;
  actions?: React.ReactNode;
  scrolled?: boolean;
}

export function Topbar({ title, actions }: TopbarProps) {
  const { setMobileNavOpen, toggleCommand } = useUIStore();

  return (
    <header
      className={cn(
        "relative z-20 flex h-16 shrink-0 items-center gap-2 border-b border-[var(--border-color)] px-4 sm:gap-3 sm:px-6 lg:px-8",
        // Plain bar over the dots. <main> scrolls separately below it, so it needs no fill or blur.
      )}
    >
      {/* Mobile menu */}
      <button
        type="button"
        onClick={() => setMobileNavOpen(true)}
        className="-ml-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)] lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {title && (
        <h1 className="min-w-0 truncate text-[28px] text-[var(--text-primary)]">
          {title}
        </h1>
      )}

      <div className="flex-1" />

      {actions && <div className="flex min-w-0 items-center gap-2">{actions}</div>}

      {/* Command palette trigger */}
      <button
        type="button"
        onClick={toggleCommand}
        aria-label="Search (⌘K)"
        className={cn(
          "flex h-8 shrink-0 items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)]",
          "w-8 justify-center text-sm text-[var(--text-muted)] sm:w-auto sm:justify-start sm:pl-2.5 sm:pr-1.5",
          "transition-colors duration-150 hover:text-[var(--text-primary)]",
        )}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden pr-6 sm:inline">Search</span>
        <kbd className="hidden rounded border border-[var(--border-color)] bg-[var(--bg-inset)] px-1.5 py-px font-sans text-[11px] text-[var(--text-muted)] sm:inline">
          ⌘K
        </kbd>
      </button>

      <ThemeToggle />

      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-8 w-8 rounded-full",
          },
        }}
      />
    </header>
  );
}
