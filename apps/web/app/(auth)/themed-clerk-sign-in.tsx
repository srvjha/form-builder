"use client";

import { SignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import type { ClerkAppearanceTheme } from "@clerk/nextjs/types";
import { useThemeStore } from "@/stores/theme-store";
import { clerkAppearanceDark, clerkAppearanceLight } from "@/app/(auth)/clerk-appearance";

function resolveAccent(): string {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-accent")
      .trim() || "#FF3B00"
  );
}

function withAccent(
  base: ClerkAppearanceTheme,
  accent: string,
): ClerkAppearanceTheme {
  return {
    ...base,
    variables: {
      ...base.variables,
      colorPrimary: accent,
    },
    elements: {
      ...base.elements,
      footerActionLink: `!text-[${accent}]`,
    },
  };
}

export function ThemedClerkSignIn() {
  const resolved = useThemeStore((s) => s.resolved);
  const theme = useThemeStore((s) => s.theme);
  const [accent, setAccent] = useState("#FF3B00");

  useEffect(() => {
    setAccent(resolveAccent());
  }, [theme, resolved]);

  const base = resolved === "dark" ? clerkAppearanceDark : clerkAppearanceLight;
  return <SignIn appearance={withAccent(base, accent)} />;
}
