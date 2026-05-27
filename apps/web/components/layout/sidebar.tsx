"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Compass, Palette, Settings, ChevronLeft, ChevronRight, Zap, Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/ui-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ROUTES, APP_NAME } from "@/lib/constants";

const NAV = [
  { label: "Dashboard",  href: ROUTES.dashboard,  Icon: LayoutDashboard },
  { label: "Forms",      href: ROUTES.forms,       Icon: FileText },
  { label: "Explore",    href: ROUTES.explore,     Icon: Compass },
];

const NAV_BOTTOM = [
  { label: "Themes",   href: ROUTES.themes,   Icon: Palette },
  { label: "Settings", href: ROUTES.settings, Icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 56 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex h-full shrink-0 flex-col",
        "border-r-2 border-[var(--border-color)] bg-[var(--bg-panel)]",
        "overflow-hidden",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b-2 border-[var(--border-color)] px-3">
        <Link href={ROUTES.dashboard} className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--color-accent)] border-2 border-[var(--border-color)]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
                className="font-display text-sm font-extrabold uppercase tracking-widest whitespace-nowrap truncate"
              >
                {APP_NAME}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Create Form CTA */}
      <div className="px-2 py-3 border-b-2 border-[var(--border-color)]">
        <Link
          href={ROUTES.formNew}
          className={cn(
            "group relative flex h-9 w-full items-center justify-center gap-2 overflow-hidden",
            "border-2 border-[var(--border-color)] bg-[var(--color-accent)]",
            "font-display text-xs font-extrabold uppercase tracking-wider text-white",
            "shadow-[2px_2px_0_var(--border-color)]",
            "transition-all duration-100",
            "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.12 }}
                className="whitespace-nowrap"
              >
                New Form
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-0.5 px-2">
          {NAV.map(({ label, href, Icon }) => (
            <NavItem
              key={href}
              label={label}
              href={href}
              Icon={Icon}
              active={pathname === href || pathname.startsWith(href + "/")}
              collapsed={!sidebarOpen}
            />
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Bottom nav */}
      <nav className="flex flex-col gap-0.5 px-2 py-3">
        {NAV_BOTTOM.map(({ label, href, Icon }) => (
          <NavItem
            key={href}
            label={label}
            href={href}
            Icon={Icon}
            active={pathname.startsWith(href)}
            collapsed={!sidebarOpen}
          />
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "flex h-10 w-full shrink-0 items-center border-t-2 border-[var(--border-color)]",
          "px-3 text-[var(--text-muted)] hover:bg-[var(--bg-inset)]",
          "transition-colors duration-100",
          "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-accent)]",
        )}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0" />
        )}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="ml-2 text-xs font-bold uppercase tracking-wider"
            >
              Collapse
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.aside>
  );
}

function NavItem({
  label,
  href,
  Icon,
  active,
  collapsed,
}: {
  label:    string;
  href:     string;
  Icon:     React.ElementType;
  active:   boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-9 items-center gap-3 px-2",
        "text-xs font-bold uppercase tracking-wider",
        "transition-colors duration-100 rounded-none",
        active
          ? "bg-[var(--bg-inset)] text-[var(--color-accent)] border-l-[3px] border-l-[var(--color-accent)]"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.12 }}
            className="truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
