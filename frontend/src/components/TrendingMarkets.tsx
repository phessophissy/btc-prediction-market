"use client";

import { Flame, TrendingUp } from "lucide-react";
import Link from "next/link";

interface TrendingMarket {
  id: number;
  title: string;
  totalPool: number;
  yesPercent: number;
}

interface TrendingMarketsProps {
  markets: TrendingMarket[];
  className?: string;
}

export function TrendingMarkets({ markets, className = "" }: TrendingMarketsProps) {
  if (markets.length === 0) return null;

  return (
    <section className={`panel-soft p-5 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <Flame className="h-4 w-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-white">Trending Now</h3>
      </div>
      <ul className="space-y-2">
        {markets.map((m, idx) => (
          <li key={m.id}>
            <Link
              href={`/market/${m.id}`}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-white/40">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/80 group-hover:text-white">
                  {m.title}
                </p>
                <p className="text-xs text-white/40">
                  {(m.totalPool / 1_000_000).toFixed(2)} STX pool
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-300">
                <TrendingUp className="h-3 w-3" />
                {m.yesPercent.toFixed(0)}%
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
