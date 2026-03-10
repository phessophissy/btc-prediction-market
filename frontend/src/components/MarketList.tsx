"use client";

import { useEffect, useState } from "react";
import { MarketCard } from "./MarketCard";
import { EmptyState } from "./EmptyState";
import { fetchActiveMarkets, Market } from "@/lib/contractService";

interface MarketListProps {
  showSettled?: boolean;
}

export function MarketList({ showSettled = false }: MarketListProps) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMarkets() {
      try {
        setLoading(true);
        setError(null);
        const allMarkets = await fetchActiveMarkets();
        // Filter based on settled status if needed
        const filtered = showSettled
          ? allMarkets.filter((m) => m.settled)
          : allMarkets.filter((m) => !m.settled);
        setMarkets(filtered);
      } catch (err) {
        console.error("Failed to load markets:", err);
        setError("Failed to load markets. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadMarkets();
  }, [showSettled]);

  if (loading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="mb-4 h-6 w-3/4 rounded-full bg-white/10" />
            <div className="mb-6 h-4 w-1/2 rounded-full bg-white/10" />
            <div className="h-20 rounded-[1.25rem] bg-white/8" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center">
        <p className="mb-4 text-rose-300">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <EmptyState
        title={showSettled ? "No settled markets" : "No active markets"}
        description={
          showSettled
            ? "There are no settled markets to display yet."
            : "No active markets are available right now. Be the first to create one."
        }
      />
    );
  }

  return (
    <div className="grid gap-6">
      {markets.map((market) => (
        <MarketCard
          key={market.id}
          market={{
            id: market.id,
            title: market.title,
            description: market.description,
            settlementHeight: market.settlementHeight,
            currentBurnHeight: market.currentBurnHeight,
            totalPool: market.totalPool,
            outcomeAPoll: market.outcomeAPool,
            outcomeBPool: market.outcomeBPool,
            outcomeCPool: market.outcomeCPool,
            outcomeDPool: market.outcomeDPool,
            settled: market.settled,
            type: market.type,
          }}
        />
      ))}
    </div>
  );
}
