"use client";

import { MarketList } from "@/components/MarketList";
import { PageHero } from "@/components/PageHero";
import { StatsOverview } from "@/components/StatsOverview";

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Market directory"
        title="All markets"
        description="Browse every Bitcoin-anchored prediction market with brighter pool signals, cleaner cards, and a more readable odds board."
        compact
      />

      <StatsOverview />
      <MarketList />
    </div>
  );
}
