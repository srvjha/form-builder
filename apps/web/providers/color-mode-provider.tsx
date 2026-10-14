"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme-store";

/* Applies light/dark to <html> (the `.dark` class drives the tokens in globals.css)
   and keeps the resolved mode in the store so components can read it. */
export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const colorMode = useThemeStore((s) => s.colorMode);
  const setResolved = useThemeStore((s) => s.setResolved);

  useEffect(() => {
    const root = document.documentElement;

    function apply(mode: "light" | "dark") {
      root.classList.toggle("dark", mode === "dark");
      root.style.colorScheme = mode;
      setResolved(mode);
    }

    if (colorMode !== "system") {
      apply(colorMode);
      return;
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    apply(mq.matches ? "dark" : "light");
    const onChange = (e: MediaQueryListEvent) => apply(e.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [colorMode, setResolved]);

  return <>{children}</>;
}
