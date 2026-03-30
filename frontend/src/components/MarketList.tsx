"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { MarketCard } from "./MarketCard";
import { EmptyState } from "./EmptyState";
import { LoadingCard } from "./LoadingCard";
import { fetchActiveMarkets, Market } from "@/lib/contractService";

interface MarketListProps {
  showSettled?: boolean;
}

export function MarketList({ showSettled = false }: MarketListProps) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "binary" | "multi">("all");
  const [sortBy, setSortBy] = useState<"soonest" | "largest-pool" | "newest">("soonest");

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
        {[1, 2, 3].map((i) => <LoadingCard key={i} lines={4} />)}
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

  const visibleMarkets = markets
    .filter((market) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesType = typeFilter === "all" || market.type === typeFilter;
      if (!normalizedQuery) return matchesType;

      return matchesType && [market.title, market.description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    })
    .sort((left, right) => {
      if (sortBy === "largest-pool") {
        return right.totalPool - left.totalPool;
      }

      if (sortBy === "newest") {
        return right.createdAtBurnHeight - left.createdAtBurnHeight;
      }

      return left.settlementHeight - right.settlementHeight;
    });

  if (visibleMarkets.length === 0) {
    return (
      <div className="space-y-4">
        <div className="card">
          <label className="mb-2 block text-sm text-slate-300">Search markets</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="input pl-11"
              placeholder="Search by market question or description"
            />
          </div>
        </div>
        <EmptyState
          title="No markets match this search"
          description="Try a broader keyword to bring more Bitcoin market cards back into view."
        />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setQuery("")}
            className="btn-secondary"
          >
            Reset search
          </button>
        </div>
      </div>
    );
  }

  const binaryCount = visibleMarkets.filter((market) => market.type === "binary").length;
  const multiCount = visibleMarkets.length - binaryCount;
  const totalVisiblePool = visibleMarkets.reduce((sum, market) => sum + market.totalPool, 0);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-300">Browse and refine the current market set</p>
          <span className="pill border border-white/10 bg-white/6 text-slate-200">
            {visibleMarkets.length} results
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Search markets</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="input pl-11"
                placeholder="Search by market question or description"
              />
              {query ? (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/8 hover:text-white"
                  onClick={() => setQuery("")}
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Market type</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All" },
                { value: "binary", label: "Binary" },
                { value: "multi", label: "Multi" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  data-active={typeFilter === option.value}
                  onClick={() => setTypeFilter(option.value as typeof typeFilter)}
                  className="btn-pill"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="market-sort" className="mb-2 block text-sm text-slate-300">
              Sort by
            </label>
            <select
              id="market-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
              className="select min-w-[12rem]"
            >
              <option value="soonest">Settlement soonest</option>
              <option value="largest-pool">Largest pool</option>
              <option value="newest">Newest markets</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Visible markets</p>
          <p className="mt-2 text-3xl font-semibold text-white">{visibleMarkets.length}</p>
        </div>
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Binary vs multi</p>
          <p className="mt-2 text-3xl font-semibold text-sky-300">
            {binaryCount} / <span className="text-rose-300">{multiCount}</span>
          </p>
        </div>
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Visible liquidity</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">
            {(totalVisiblePool / 1_000_000).toFixed(2)} STX
          </p>
        </div>
      </div>

      <div className="glass-strip flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
        <span>
          {showSettled
            ? "Settled archive mode surfaces completed market snapshots."
            : "Live mode prioritizes open markets with the fastest settlement windows first."}
        </span>
        <span className="text-slate-400">Search, filter, and sort update instantly.</span>
      </div>

      <div className="grid gap-6">
        {visibleMarkets.map((market) => (
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
    </div>
  );
}
