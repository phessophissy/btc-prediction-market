"use client";

import { MarketList } from "@/components/MarketList";
import { StatsOverview } from "@/components/StatsOverview";

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">All Markets</h1>
        <p className="text-gray-400">Browse and bet on Bitcoin-anchored prediction markets</p>
      </div>
      
      <StatsOverview />
      <MarketList />
    </div>
  );
}
