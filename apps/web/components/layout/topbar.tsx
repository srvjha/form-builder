"use client";

import { Menu, Command as CommandIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useUIStore } from "@/stores/ui-store";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopbarProps {
  title?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, actions }: TopbarProps) {
  const { toggleSidebar, toggleCommand } = useUIStore();

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-3 px-4",
        "border-b-2 border-[var(--border-color)] bg-[var(--bg-panel)]",
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
        <h1 className="font-display text-sm font-extrabold uppercase tracking-widest truncate">
          {title}
        </h1>
      )}

      <div className="flex-1" />

      {/* Action slot */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}

      {/* Command palette trigger */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleCommand}
        className="hidden gap-2 border-[var(--border-muted)] text-[var(--text-muted)] sm:flex"
        aria-label="Open command palette"
      >
        <CommandIcon className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="ml-1 bg-[var(--bg-inset)] border border-[var(--border-muted)] px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </Button>

      <ThemeToggle />

      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-8 w-8 rounded-none border-2 border-[var(--border-color)]",
          },
        }}
      />
    </header>
  );
}
