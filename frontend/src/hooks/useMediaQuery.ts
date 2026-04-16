"use client";

import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query and return whether it currently matches.
 * Returns false during SSR to avoid hydration mismatches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    function onChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Convenience: true when viewport is at most 640px wide. */
export function useIsMobile() {
  return useMediaQuery("(max-width: 640px)");
}

/** Convenience: true when viewport is at least 1024px wide. */
export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}
