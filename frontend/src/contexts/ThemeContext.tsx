"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

/**
 * Theme options for the BTC Predict Studio frontend.
 *
 * - "studio": the default dark editorial look (unchanged from before).
 * - "aurora": an opt-in sleeker variant with aurora gradients and
 *   stronger micro-interactions, layered on top of the same design system.
 *
 * The active theme is mirrored onto <html data-theme="..."> so that the
 * CSS variable overrides in globals.css take effect. The choice is
 * persisted in localStorage and survives reloads. When no theme is
 * stored (or storage is unavailable) we default to "studio", meaning the
 * site looks exactly as it did before this feature shipped.
 */

export type Theme = "studio" | "aurora";

export const THEME_STORAGE_KEY = "btc-pm-theme";
export const THEMES: readonly Theme[] = ["studio", "aurora"];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (next: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isTheme(value: string | null): value is Theme {
  return value === "studio" || value === "aurora";
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "studio";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "studio";
  } catch {
    return "studio";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("studio");

  // Hydrate from storage after mount.
  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  // Reflect the theme onto <html> as soon as we know it, before paint.
  useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "studio") {
      // Default look: no overrides. Clear any previously set attribute
      // so the base :root variables apply untouched.
      delete root.dataset.theme;
    } else {
      root.dataset.theme = theme;
    }
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // storage unavailable / quota — in-memory state still updates
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "studio" ? "aurora" : "studio";
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
