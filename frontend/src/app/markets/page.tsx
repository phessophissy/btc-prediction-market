"use client";

import { MarketList } from "@/components/MarketList";
import { StatsOverview } from "@/components/StatsOverview";

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <div className="hero-panel py-8">
        <span className="eyebrow mb-4">Market directory</span>
        <h1 className="mb-3 text-5xl">All markets</h1>
        <p className="max-w-2xl text-slate-300">
          Browse every Bitcoin-anchored prediction market with brighter pool
          signals, cleaner cards, and a more readable odds board.
        </p>
      </div>

      <StatsOverview />
      <MarketList />
    </div>
  );
}
