"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/ui-store";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandShortcut, CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { LayoutDashboard, FileText, Plus, Settings, Compass } from "lucide-react";

interface AppShellProps {
  children:   React.ReactNode;
  title?:     string;
  actions?:   React.ReactNode;
}

export function AppShell({ children, title, actions }: AppShellProps) {
  const { commandOpen, setCommandOpen } = useUIStore();
  const router = useRouter();
  /* ⌘K shortcut */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setCommandOpen]);

  function navigate(href: string) {
    setCommandOpen(false);
    router.push(href);
  }

  return (
    // No fill here: the dot grid on <body> is the ground the whole app sits on
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar title={title} actions={actions} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search pages and actions" />
        <CommandList>
          <CommandEmpty>Nothing matches that search.</CommandEmpty>

          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => navigate(ROUTES.formNew)}>
              <Plus className="h-4 w-4 text-[var(--text-muted)]" />
              Create form
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => navigate(ROUTES.dashboard)}>
              <LayoutDashboard className="h-4 w-4 text-[var(--text-muted)]" />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => navigate(ROUTES.forms)}>
              <FileText className="h-4 w-4 text-[var(--text-muted)]" />
              Forms
            </CommandItem>
            <CommandItem onSelect={() => navigate(ROUTES.explore)}>
              <Compass className="h-4 w-4 text-[var(--text-muted)]" />
              Explore
            </CommandItem>
            <CommandItem onSelect={() => navigate(ROUTES.settings)}>
              <Settings className="h-4 w-4 text-[var(--text-muted)]" />
              Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
