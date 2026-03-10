"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { getPlatformStats, formatSTX } from "@/lib/contractService";

interface StatItem {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  change: string;
}

export function StatsOverview() {
  const [stats, setStats] = useState<StatItem[]>([
    {
      label: "Total Markets",
      value: "...",
      icon: TrendingUp,
      change: "Loading...",
    },
    {
      label: "Total Volume",
      value: "...",
      icon: DollarSign,
      change: "Loading...",
    },
    {
      label: "Platform Fees",
      value: "...",
      icon: Users,
      change: "5% on winnings",
    },
    {
      label: "Settlement",
      value: "~10 min",
      icon: Clock,
      change: "Bitcoin finality",
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
          },
          {
            label: "Total Volume",
            value: `${formatSTX(platformStats.totalVolume)} STX`,
            icon: DollarSign,
            change: "Across all markets",
          },
          {
            label: "Fees Collected",
            value: `${formatSTX(platformStats.totalFeesCollected)} STX`,
            icon: Users,
            change: "5% on winnings",
          },
          {
            label: "Settlement",
            value: "~10 min",
            icon: Clock,
            change: "Bitcoin finality",
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`card relative overflow-hidden ${loading ? "animate-pulse" : ""}`}
        >
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-300">{stat.label}</p>
              <p className="metric-value mt-3 text-4xl">{stat.value}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-sky-300">
                {stat.change}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
              <stat.icon className="h-8 w-8 text-amber-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
