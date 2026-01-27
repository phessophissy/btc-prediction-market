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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`card ${loading ? "animate-pulse" : ""}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-stacks mt-2">{stat.change}</p>
            </div>
            <stat.icon className="w-10 h-10 text-slate-600" />
          </div>
        </div>
      ))}
    </div>
  );
}
