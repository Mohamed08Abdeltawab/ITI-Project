import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Synchronizes the root <html> element class with the active theme mode.
 * @param {"light" | "dark"} mode
 */
const syncHtmlThemeClass = (mode) => {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
};

export const useThemeStore = create(
  persist(
    (set) => ({
      themeMode: "light",

      /**
       * Toggles between "light" and "dark" mode.
       */
      toggleTheme: () =>
        set((state) => {
          const nextMode = state.themeMode === "light" ? "dark" : "light";
          syncHtmlThemeClass(nextMode);
          return { themeMode: nextMode };
        }),

      /**
       * Directly sets the theme mode to "light" or "dark".
       * @param {"light" | "dark"} mode
       */
      setThemeMode: (mode) => {
        syncHtmlThemeClass(mode);
        set({ themeMode: mode });
      },
    }),
    {
      name: "carepoint-theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.themeMode) {
          syncHtmlThemeClass(state.themeMode);
        }
      },
    },
  ),
);
