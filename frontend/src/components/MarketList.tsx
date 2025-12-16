"use client";

import { MarketCard } from "./MarketCard";

// Mock data - in real app, fetch from contract
const mockMarkets = [
  {
    id: 0,
    title: "Will BTC block #880,000 have an even hash?",
    description: "Predict the parity of Bitcoin block hash",
    settlementHeight: 880000,
    currentBurnHeight: 879950,
    totalPool: 45000000,
    outcomeAPoll: 28000000,
    outcomeBPool: 17000000,
    settled: false,
    type: "binary" as const,
  },
  {
    id: 1,
    title: "Block #880,500 hash first byte range",
    description: "Which quarter will the first byte fall into?",
    settlementHeight: 880500,
    currentBurnHeight: 879950,
    totalPool: 120000000,
    outcomeAPoll: 35000000,
    outcomeBPool: 40000000,
    outcomeCPool: 25000000,
    outcomeDPool: 20000000,
    settled: false,
    type: "multi" as const,
  },
  {
    id: 2,
    title: "Will block #881,000 hash end in 0-7?",
    description: "Predict if last hex digit is 0-7 (A) or 8-F (B)",
    settlementHeight: 881000,
    currentBurnHeight: 879950,
    totalPool: 78000000,
    outcomeAPoll: 42000000,
    outcomeBPool: 36000000,
    settled: false,
    type: "binary" as const,
  },
];

export function MarketList() {
  return (
    <div className="grid gap-6">
      {mockMarkets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  );
}
