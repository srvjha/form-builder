"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorMode, setResolved } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    function applyTheme(mode: "light" | "dark") {
      root.classList.toggle("dark", mode === "dark");
      setResolved(mode);
    }

    if (colorMode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mq.matches ? "dark" : "light");
      const handler = (e: MediaQueryListEvent) =>
        applyTheme(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      applyTheme(colorMode);
    }
  }, [colorMode, setResolved]);

  return <>{children}</>;
}
