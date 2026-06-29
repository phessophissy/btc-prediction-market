"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Palette, Sparkles } from "lucide-react";

/**
 * Compact pill that toggles between the default "studio" theme and the
 * opt-in "aurora" theme. Renders the current theme name on >= sm screens
 * and an icon-only button on mobile. The choice persists via the
 * ThemeProvider (localStorage key "btc-pm-theme").
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isAurora = theme === "aurora";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isAurora}
      aria-label={isAurora ? "Switch to Studio theme" : "Switch to Aurora theme"}
      title={isAurora ? "Switch to Studio theme" : "Switch to Aurora theme"}
      className="theme-toggle inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {isAurora ? (
        <Sparkles className="h-4 w-4 text-violet-300" />
      ) : (
        <Palette className="h-4 w-4 text-amber-300" />
      )}
      <span className="hidden sm:inline">{isAurora ? "Aurora" : "Studio"}</span>
    </button>
  );
}
