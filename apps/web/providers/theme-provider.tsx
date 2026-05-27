"use client";

import { useEffect } from "react";
import { useThemeStore, type FormTheme } from "@/stores/theme-store";

// ── CSS variable tokens per form theme ────────────────────────────────────────
// Only the vars that differ from the Brutalist default in globals.css.
// Applied via element.style.setProperty so they take precedence over the
// stylesheet but can still be layered under/over the .dark class.
const THEME_TOKENS: Record<FormTheme, Record<string, string>> = {
  brutalist: {}, // uses globals.css defaults — nothing to inject

  ocean: {
    "--color-accent":       "#0EA5E9",
    "--color-accent-hover": "#0284C7",
    "--bg-page":            "#F0F9FF",
    "--bg-panel":           "#FFFFFF",
    "--bg-inset":           "#E0F2FE",
    "--text-primary":       "#0C4A6E",
    "--text-secondary":     "#1E5A8A",
    "--text-muted":         "#64748B",
    "--border-color":       "#0C4A6E",
    "--border-muted":       "#BAE6FD",
    "--shadow-xs":          "2px 2px 0px #0C4A6E",
    "--shadow-sm":          "3px 3px 0px #0C4A6E",
    "--shadow-md":          "4px 4px 0px #0C4A6E",
    "--shadow-lg":          "6px 6px 0px #0C4A6E",
    "--shadow-xl":          "8px 8px 0px #0C4A6E",
    "--shadow-accent":      "4px 4px 0px #0EA5E9",
  },

  midnight: {
    "--color-accent":       "#818CF8",
    "--color-accent-hover": "#6366F1",
    "--bg-page":            "#0F0F1A",
    "--bg-panel":           "#1A1A2E",
    "--bg-inset":           "#252540",
    "--text-primary":       "#E2E8F0",
    "--text-secondary":     "#CBD5E1",
    "--text-muted":         "#94A3B8",
    "--text-inverse":       "#0F0F1A",
    "--border-color":       "#818CF8",
    "--border-muted":       "#312E81",
    "--shadow-xs":          "2px 2px 0px #818CF8",
    "--shadow-sm":          "3px 3px 0px #818CF8",
    "--shadow-md":          "4px 4px 0px #818CF8",
    "--shadow-lg":          "6px 6px 0px #818CF8",
    "--shadow-xl":          "8px 8px 0px #818CF8",
    "--shadow-accent":      "4px 4px 0px #818CF8",
  },

  forest: {
    "--color-accent":       "#16A34A",
    "--color-accent-hover": "#15803D",
    "--bg-page":            "#F0FDF4",
    "--bg-panel":           "#FFFFFF",
    "--bg-inset":           "#DCFCE7",
    "--text-primary":       "#14532D",
    "--text-secondary":     "#166534",
    "--text-muted":         "#4B7C5E",
    "--border-color":       "#14532D",
    "--border-muted":       "#86EFAC",
    "--shadow-xs":          "2px 2px 0px #14532D",
    "--shadow-sm":          "3px 3px 0px #14532D",
    "--shadow-md":          "4px 4px 0px #14532D",
    "--shadow-lg":          "6px 6px 0px #14532D",
    "--shadow-xl":          "8px 8px 0px #14532D",
    "--shadow-accent":      "4px 4px 0px #16A34A",
  },

  solar: {
    "--color-accent":       "#D97706",
    "--color-accent-hover": "#B45309",
    "--bg-page":            "#FFFBEB",
    "--bg-panel":           "#FFFFFF",
    "--bg-inset":           "#FEF3C7",
    "--text-primary":       "#78350F",
    "--text-secondary":     "#92400E",
    "--text-muted":         "#A16207",
    "--border-color":       "#78350F",
    "--border-muted":       "#FDE68A",
    "--shadow-xs":          "2px 2px 0px #78350F",
    "--shadow-sm":          "3px 3px 0px #78350F",
    "--shadow-md":          "4px 4px 0px #78350F",
    "--shadow-lg":          "6px 6px 0px #78350F",
    "--shadow-xl":          "8px 8px 0px #78350F",
    "--shadow-accent":      "4px 4px 0px #D97706",
  },

  lavender: {
    "--color-accent":       "#7C3AED",
    "--color-accent-hover": "#6D28D9",
    "--bg-page":            "#FAF5FF",
    "--bg-panel":           "#FFFFFF",
    "--bg-inset":           "#EDE9FE",
    "--text-primary":       "#2E1065",
    "--text-secondary":     "#4C1D95",
    "--text-muted":         "#7E22CE",
    "--border-color":       "#2E1065",
    "--border-muted":       "#DDD6FE",
    "--shadow-xs":          "2px 2px 0px #2E1065",
    "--shadow-sm":          "3px 3px 0px #2E1065",
    "--shadow-md":          "4px 4px 0px #2E1065",
    "--shadow-lg":          "6px 6px 0px #2E1065",
    "--shadow-xl":          "8px 8px 0px #2E1065",
    "--shadow-accent":      "4px 4px 0px #7C3AED",
  },

  monochrome: {
    "--color-accent":       "#171717",
    "--color-accent-hover": "#000000",
    "--bg-page":            "#FAFAFA",
    "--bg-panel":           "#FFFFFF",
    "--bg-inset":           "#F5F5F5",
    "--text-primary":       "#171717",
    "--text-secondary":     "#404040",
    "--text-muted":         "#737373",
    "--border-color":       "#171717",
    "--border-muted":       "#D4D4D4",
    "--shadow-xs":          "2px 2px 0px #171717",
    "--shadow-sm":          "3px 3px 0px #171717",
    "--shadow-md":          "4px 4px 0px #171717",
    "--shadow-lg":          "6px 6px 0px #171717",
    "--shadow-xl":          "8px 8px 0px #171717",
    "--shadow-accent":      "4px 4px 0px #171717",
  },

  coral: {
    "--color-accent":       "#F43F5E",
    "--color-accent-hover": "#E11D48",
    "--bg-page":            "#FFF1F2",
    "--bg-panel":           "#FFFFFF",
    "--bg-inset":           "#FFE4E6",
    "--text-primary":       "#881337",
    "--text-secondary":     "#9F1239",
    "--text-muted":         "#BE123C",
    "--border-color":       "#881337",
    "--border-muted":       "#FECDD3",
    "--shadow-xs":          "2px 2px 0px #881337",
    "--shadow-sm":          "3px 3px 0px #881337",
    "--shadow-md":          "4px 4px 0px #881337",
    "--shadow-lg":          "6px 6px 0px #881337",
    "--shadow-xl":          "8px 8px 0px #881337",
    "--shadow-accent":      "4px 4px 0px #F43F5E",
  },
};

// All vars that could be set by any theme — used to clean up on theme switch
const ALL_THEME_VARS = [
  "--color-accent", "--color-accent-hover",
  "--bg-page", "--bg-panel", "--bg-inset",
  "--text-primary", "--text-secondary", "--text-muted", "--text-inverse",
  "--border-color", "--border-muted",
  "--shadow-xs", "--shadow-sm", "--shadow-md", "--shadow-lg", "--shadow-xl", "--shadow-accent",
];

// Vars that are ONLY injected in light mode — surfaces/borders that the
// .dark CSS class owns. In dark mode we still inject accent so the brand
// colour stays consistent, but let the stylesheet handle backgrounds.
const SURFACE_VARS = new Set([
  "--bg-page", "--bg-panel", "--bg-inset",
  "--text-primary", "--text-secondary", "--text-muted", "--text-inverse",
  "--border-color", "--border-muted",
  "--shadow-xs", "--shadow-sm", "--shadow-md", "--shadow-lg", "--shadow-xl",
]);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorMode, theme, resolved, setResolved } = useThemeStore();

  // ── Light / dark mode ────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;

    function applyColorMode(mode: "light" | "dark") {
      root.classList.toggle("dark", mode === "dark");
      setResolved(mode);
    }

    if (colorMode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyColorMode(mq.matches ? "dark" : "light");
      const handler = (e: MediaQueryListEvent) =>
        applyColorMode(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      applyColorMode(colorMode);
    }
  }, [colorMode, setResolved]);

  // ── Form theme CSS variable injection ────────────────────────────────────
  // Re-runs when theme OR resolved mode changes so dark mode always wins
  // over light-theme surface colours.
  useEffect(() => {
    const root = document.documentElement;
    const tokens = THEME_TOKENS[theme] ?? {};
    const isDark = resolved === "dark";

    // Clear all previously injected vars first
    for (const varName of ALL_THEME_VARS) {
      root.style.removeProperty(varName);
    }

    for (const [varName, value] of Object.entries(tokens)) {
      // In dark mode, skip surface/text/border vars — let the .dark CSS class
      // own those. Only inject accent colour so branding stays consistent.
      if (isDark && SURFACE_VARS.has(varName)) continue;
      root.style.setProperty(varName, value);
    }
  }, [theme, resolved]);

  return <>{children}</>;
}

// Export tokens so other parts of the app (e.g. form fill page) can use them
export { THEME_TOKENS };
export type { FormTheme };
