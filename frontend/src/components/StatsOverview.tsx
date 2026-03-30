"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { getPlatformStats, formatSTX } from "@/lib/contractService";
import { MARKET_CREATION_FEE } from "@/lib/constants";
import { StatCard } from "./StatCard";

interface StatItem {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  change: string;
  accentClassName: string;
}

export function StatsOverview() {
  const [stats, setStats] = useState<StatItem[]>([
    {
      label: "Total Markets",
      value: "...",
      icon: TrendingUp,
      change: "Loading...",
      accentClassName: "text-sky-300",
    },
    {
      label: "Total Volume",
      value: "...",
      icon: DollarSign,
      change: "Loading...",
      accentClassName: "text-emerald-300",
    },
    {
      label: "Platform Fees",
      value: "...",
      icon: Users,
      change: `${formatSTX(MARKET_CREATION_FEE)} STX / market`,
      accentClassName: "text-amber-300",
    },
    {
      label: "Settlement",
      value: "~10 min",
      icon: Clock,
      change: "Bitcoin finality",
      accentClassName: "text-rose-300",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const platformStats = await getPlatformStats();
        
        setStats([
          {
            label: "Total Markets",
            value: platformStats.totalMarkets.toString(),
            icon: TrendingUp,
            change: "All-time created",
            accentClassName: "text-sky-300",
          },
          {
            label: "Total Volume",
            value: `${formatSTX(platformStats.totalVolume)} STX`,
            icon: DollarSign,
            change: "Across all markets",
            accentClassName: "text-emerald-300",
          },
          {
            label: "Fees Collected",
            value: `${formatSTX(platformStats.totalFeesCollected)} STX`,
            icon: Users,
            change: `${formatSTX(MARKET_CREATION_FEE)} STX / market`,
            accentClassName: "text-amber-300",
          },
          {
            label: "Settlement",
            value: "~10 min",
            icon: Clock,
            change: "Bitcoin finality",
            accentClassName: "text-rose-300",
          },
        ]);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-4">
      <div className="glass-strip flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
        <span>Platform snapshot</span>
        <span className="text-slate-400">Core market totals update from live contract reads and API fallbacks.</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            detail={stat.change}
            icon={stat.icon}
            accentClassName={stat.accentClassName}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}
