"use client";

import { type ReactNode, useRef } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: "slide-up" | "fade-in" | "scale-in";
  delay?: number;
  className?: string;
}

export function AnimateOnScroll({
  children,
  animation = "slide-up",
  delay = 0,
  className = "",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`${isVisible ? `animate-${animation}` : "opacity-0"} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
