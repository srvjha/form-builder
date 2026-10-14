"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import type { ClerkAppearanceTheme } from "@clerk/nextjs/types";
import { useThemeStore } from "@/stores/theme-store";
import { clerkAppearanceDark, clerkAppearanceLight } from "@/app/(auth)/clerk-appearance";

const FALLBACK_ACCENT = "#2563EB";
const DARK_ACCENT     = "#3B82F6";

// Filled-button blue: #2563EB in light mode, #3B82F6 in dark mode.
function resolveAccent(mode: "light" | "dark"): string {
  if (mode === "dark") {
    return DARK_ACCENT;
  }
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-action")
      .trim() || FALLBACK_ACCENT
  );
}

function withAccent(
  base: ClerkAppearanceTheme,
  accent: string,
): ClerkAppearanceTheme {
  // Link colour stays on the literal class in clerk-appearance.ts:
  // Tailwind cannot generate a class from a runtime string.
  return {
    ...base,
    variables: {
      ...base.variables,
      colorPrimary: accent,
    },
  };
}

function useThemedAppearance(): ClerkAppearanceTheme {
  const resolved = useThemeStore((s) => s.resolved);
  const [accent, setAccent] = useState(FALLBACK_ACCENT);

  useEffect(() => {
    setAccent(resolveAccent(resolved === "dark" ? "dark" : "light"));
  }, [resolved]);

  const base = resolved === "dark" ? clerkAppearanceDark : clerkAppearanceLight;
  return withAccent(base, accent);
}

export function ThemedClerkSignIn() {
  const appearance = useThemedAppearance();
  return <SignIn appearance={appearance} />;
}

export function ThemedClerkSignUp() {
  const appearance = useThemedAppearance();
  return <SignUp appearance={appearance} />;
}
