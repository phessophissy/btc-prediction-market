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
      >
        <div className="flex flex-wrap gap-3">
          <span className="glass-strip text-sm text-slate-200">Search by question</span>
          <span className="glass-strip text-sm text-slate-200">Filter by market type</span>
          <span className="glass-strip text-sm text-slate-200">Sort by settlement or liquidity</span>
        </div>
      </PageHero>

      <StatsOverview />
      <div className="glass-strip flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
        <span>The market directory emphasizes scan speed across active pools and settlement timing.</span>
        <span className="text-slate-400">Controls live inside the list below.</span>
      </div>
      <MarketList />
    </div>
  );
}
