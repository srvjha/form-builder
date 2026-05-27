import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FormTheme =
  | "brutalist"
  | "ocean"
  | "midnight"
  | "forest"
  | "solar"
  | "lavender"
  | "monochrome"
  | "coral";

export type ColorMode = "light" | "dark" | "system";

interface ThemeState {
  theme:     FormTheme;
  colorMode: ColorMode;
  resolved:  "light" | "dark";  // actual resolved mode (system → resolved)

  setTheme:     (theme: FormTheme) => void;
  setColorMode: (mode: ColorMode) => void;
  setResolved:  (mode: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme:     "brutalist",
      colorMode: "system",
      resolved:  "light",

      setTheme:     (theme)     => set({ theme }),
      setColorMode: (colorMode) => set({ colorMode }),
      setResolved:  (resolved)  => set({ resolved }),
    }),
    {
      name: "formcraft-theme",
      partialize: (state) => ({
        theme:     state.theme,
        colorMode: state.colorMode,
      }),
    },
  ),
);
