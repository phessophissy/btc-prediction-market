"use client";

import { Bitcoin, TrendingDown, TrendingUp } from "lucide-react";
import { useBtcPrice } from "../hooks/useBtcPrice";

export function BtcPriceTicker({ className = "" }: { className?: string }) {
  const { price, change24h, loading } = useBtcPrice();

  if (loading || price === null) {
    return (
      <div className={`glass-strip animate-pulse text-sm text-white/40 ${className}`}>
        <Bitcoin className="h-4 w-4" />
        Loading…
      </div>
    );
  }

  const isPositive = (change24h ?? 0) >= 0;

  return (
    <div className={`glass-strip text-sm ${className}`}>
      <Bitcoin className="h-4 w-4 text-amber-300" />
      <span className="font-semibold text-white">
        ${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </span>
      {change24h !== null && (
        <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-emerald-300" : "text-rose-300"}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(change24h).toFixed(2)}%
        </span>
      )}
    </div>
  );
}
