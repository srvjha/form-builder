import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ColorMode = "light" | "dark" | "system";

interface ThemeState {
  colorMode: ColorMode;
  resolved:  "light" | "dark";  // actual resolved mode (system → resolved)

  setColorMode: (mode: ColorMode) => void;
  setResolved:  (mode: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorMode: "system",
      resolved:  "light",

      setColorMode: (colorMode) => set({ colorMode }),
      setResolved:  (resolved)  => set({ resolved }),
    }),
    {
      name: "formcraft-theme",
      partialize: (state) => ({ colorMode: state.colorMode }),
    },
  ),
);
