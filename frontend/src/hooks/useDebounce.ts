"use client";

import { useEffect, useState } from "react";

/**
 * Debounce a rapidly-changing value. Returns a copy that only updates
 * after `delay` ms of inactivity. Useful for search inputs.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// [feat/batch-betting] commit 3/10: update hooks layer – 1776638348933644767
