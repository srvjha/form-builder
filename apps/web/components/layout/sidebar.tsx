"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Compass, Settings, PanelLeftClose, PanelLeftOpen, Plus, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/ui-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ROUTES, APP_NAME } from "@/lib/constants";

const NAV = [
  { label: "Dashboard",  href: ROUTES.dashboard,  Icon: LayoutDashboard },
  { label: "Forms",      href: ROUTES.forms,       Icon: FileText },
  { label: "Explore",    href: ROUTES.explore,     Icon: Compass },
];

const NAV_BOTTOM = [
  { label: "Settings", href: ROUTES.settings, Icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, mobileNavOpen, setMobileNavOpen } = useUIStore();

  /* Close the mobile drawer whenever the route changes */
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  /* Escape closes the mobile drawer */
  useEffect(() => {
    if (!mobileNavOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileNavOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen, setMobileNavOpen]);

  return (
    <>
      {/* Desktop: transparent rail over the dot ground */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 232 : 64 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden h-full shrink-0 flex-col overflow-hidden border-r border-[var(--border-color)] lg:flex"
      >
        <SidebarContent pathname={pathname} collapsed={!sidebarOpen} />

        <button
          onClick={toggleSidebar}
          className={cn(
            "flex h-11 w-full shrink-0 items-center gap-3 border-t border-[var(--border-color)]",
            sidebarOpen ? "px-[22px]" : "justify-center px-0",
            "text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]",
          )}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4 shrink-0" />
          ) : (
            <PanelLeftOpen className="h-4 w-4 shrink-0" />
          )}
          {sidebarOpen && <span className="whitespace-nowrap">Collapse</span>}
        </button>
      </motion.aside>

      {/* Mobile: drawer over a scrim */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-[var(--bg-overlay)]"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="bg-dot-grid absolute inset-y-0 left-0 flex w-[264px] max-w-[85vw] flex-col border-r border-[var(--border-color)] bg-[var(--bg-page)]"
            >
              <button
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent pathname={pathname} collapsed={false} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ pathname, collapsed }: { pathname: string; collapsed: boolean }) {
  return (
    <>
      {/* Wordmark */}
      <div className={cn("flex h-16 shrink-0 items-center", collapsed ? "justify-center px-2" : "px-5")}>
        <Link
          href={ROUTES.home}
          aria-label={APP_NAME}
          className="font-display whitespace-nowrap text-[28px] leading-none text-[var(--text-primary)]"
        >
          {collapsed ? APP_NAME.charAt(0) : APP_NAME}
        </Link>
      </div>

      {/* The one blue button */}
      <div className={cn("pb-4 pt-1", collapsed ? "px-3" : "px-4")}>
        <Link
          href={ROUTES.formNew}
          aria-label="Create form"
          className={cn(
            "flex h-9 w-full items-center justify-center gap-2 overflow-hidden rounded-md",
            "bg-[var(--color-action)] text-sm font-medium text-white",
            "transition-colors duration-150 hover:bg-[var(--color-action-hover)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)]",
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Create form</span>}
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <nav className={"flex flex-col gap-0.5 px-3"}>
          {NAV.map(({ label, href, Icon }) => (
            <NavItem
              key={href}
              label={label}
              href={href}
              Icon={Icon}
              active={pathname === href || pathname.startsWith(href + "/")}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      <nav className="flex flex-col gap-0.5 px-3 py-3">
        {NAV_BOTTOM.map(({ label, href, Icon }) => (
          <NavItem
            key={href}
            label={label}
            href={href}
            Icon={Icon}
            active={pathname.startsWith(href)}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </>
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
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "flex h-9 items-center gap-3 rounded-md text-sm transition-colors duration-150",
        collapsed ? "justify-center px-0" : "px-2.5",
        active
          ? "bg-[var(--color-accent-soft)] font-medium text-[var(--color-accent)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
