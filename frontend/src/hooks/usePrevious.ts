"use client";

import { useEffect, useRef } from "react";

/**
 * Return the previous render's value. Useful for detecting changes
 * in props/state (e.g. animating transitions when a value updates).
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
