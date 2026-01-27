"use client";

import { useEffect, useState } from "react";
import { MarketCard } from "./MarketCard";
import { fetchActiveMarkets, Market, formatSTX } from "@/lib/contractService";

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
          <div
            key={i}
            className="bg-gray-800/50 rounded-xl p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-6" />
            <div className="h-20 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 text-center">
        <p className="text-gray-400">
          {showSettled
            ? "No settled markets found."
            : "No active markets available. Be the first to create one!"}
        </p>
      </div>
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
  );
}
