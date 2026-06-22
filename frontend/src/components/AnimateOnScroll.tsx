"use client";

import { type ReactNode, useRef, useState, useEffect } from "react";
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const animationStyles = {
    'slide-up': { initial: 'opacity-0 translate-y-8', visible: 'opacity-100 translate-y-0' },
    'fade-in': { initial: 'opacity-0', visible: 'opacity-100' },
    'scale-in': { initial: 'opacity-0 scale-95', visible: 'opacity-100 scale-100' }
  };

  const { initial, visible } = animationStyles[animation] || animationStyles['slide-up'];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? visible : initial} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
