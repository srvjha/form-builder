"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { colorMode, resolved, setColorMode } = useThemeStore();

  // Use the *resolved* mode for the icon so "system dark" shows Sun (ready to switch to light)
  const isDark = resolved === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setColorMode(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("border border-[var(--border-muted)]", className)}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
