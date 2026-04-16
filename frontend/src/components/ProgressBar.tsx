"use client";

import { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  /** 0-100 */
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: "sky" | "amber" | "emerald" | "rose" | "violet";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorMap = {
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
};

const sizeMap = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  color = "sky",
  size = "md",
  className = "",
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  // Animate on mount / value change
  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(frame);
  }, [pct]);

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="mb-1 flex items-center justify-between text-xs text-white/50">
          {label && <span>{label}</span>}
          {showPercent && <span>{pct.toFixed(1)}%</span>}
        </div>
      )}
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={`w-full overflow-hidden rounded-full bg-white/5 ${sizeMap[size]}`}
      >
        <div
          className={`${sizeMap[size]} rounded-full ${colorMap[color]} transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
