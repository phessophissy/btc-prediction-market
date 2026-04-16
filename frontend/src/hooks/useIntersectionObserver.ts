"use client";

import { type RefObject, useEffect, useState } from "react";

interface UseIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Observe whether an element is intersecting the viewport.
 * With `triggerOnce`, stops observing after first intersection.
 */
export function useIntersectionObserver<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseIntersectionOptions = {},
): boolean {
  const { threshold = 0, rootMargin = "0px", triggerOnce = false } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible && triggerOnce) {
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, triggerOnce]);

  return isVisible;
}
