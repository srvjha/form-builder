"use client";

import { Menu, Command as CommandIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useUIStore } from "@/stores/ui-store";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopbarProps {
  title?:   string;
  actions?: React.ReactNode;
  scrolled?: boolean;
}

export function Topbar({ title, actions }: TopbarProps) {
  const { toggleSidebar, toggleCommand } = useUIStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border-color)]",
        "bg-[var(--bg-panel)]/80 px-4 backdrop-blur-md sm:gap-3",
      )}
    >
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleSidebar}
        className="lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Page title */}
      {title && (
        <h1 className="font-display min-w-0 truncate text-sm font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h1>
      )}

      <div className="flex-1" />

      {/* Action slot */}
      {actions && <div className="flex min-w-0 items-center gap-2">{actions}</div>}

      {/* Command palette trigger */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleCommand}
        className="hidden gap-2 rounded-md border-[var(--border-color)] bg-[var(--bg-panel)] text-[var(--text-muted)] shadow-soft-xs sm:flex"
        aria-label="Open command palette"
      >
        <CommandIcon className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="ml-1 rounded border border-[var(--border-muted)] bg-[var(--bg-inset)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
          ⌘K
        </kbd>
      </Button>

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
