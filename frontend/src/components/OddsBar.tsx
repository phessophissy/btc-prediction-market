"use client";

import { clamp } from "../lib/formatters";

interface OddsBarProps {
  yesPercent: number;
  noPercent?: number;
  showLabels?: boolean;
  className?: string;
}

export function OddsBar({ yesPercent, noPercent, showLabels = true, className = "" }: OddsBarProps) {
  const yes = clamp(yesPercent, 0, 100);
  const no = noPercent !== undefined ? clamp(noPercent, 0, 100) : 100 - yes;

  return (
    <div className={className}>
      {showLabels && (
        <div className="mb-1.5 flex justify-between text-xs font-medium">
          <span className="text-emerald-300">Yes {yes.toFixed(1)}%</span>
          <span className="text-rose-300">No {no.toFixed(1)}%</span>
        </div>
      )}
      <div className="flex h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="rounded-l-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
          style={{ width: `${yes}%` }}
        />
        <div
          className="rounded-r-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
          style={{ width: `${no}%` }}
        />
      </div>
    </div>
  );
}
