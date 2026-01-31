"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, DollarSign, Clock, Zap } from "lucide-react";
import { getPlatformStats, formatSTX } from "@/lib/contractService";

interface StatItem {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  change: string;
  gradient: string;
}

export function StatsOverview() {
  const [stats, setStats] = useState<StatItem[]>([
    {
      label: "Total Markets",
      value: "...",
      icon: TrendingUp,
      change: "All-time",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Volume",
      value: "...",
      icon: DollarSign,
      change: "In STX",
      gradient: "from-orange-500 to-red-500",
    },
    {
      label: "Fees Collected",
      value: "...",
      icon: Zap,
      change: "Platform revenue",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      label: "Settlement",
      value: "~10 min",
      icon: Clock,
      change: "Bitcoin finality",
      gradient: "from-purple-500 to-pink-500",
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
            gradient: "from-blue-500 to-cyan-500",
          },
          {
            label: "Total Volume",
            value: `${formatSTX(platformStats.totalVolume)} STX`,
            icon: DollarSign,
            change: "Across all markets",
            gradient: "from-orange-500 to-red-500",
          },
          {
            label: "Fees Collected",
            value: `${formatSTX(platformStats.totalFeesCollected)} STX`,
            icon: Zap,
            change: "5% on winnings",
            gradient: "from-yellow-500 to-orange-500",
          },
          {
            label: "Settlement",
            value: "~10 min",
            icon: Clock,
            change: "Bitcoin finality",
            gradient: "from-purple-500 to-pink-500",
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
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`group relative overflow-hidden rounded-xl border border-gray-800 hover:border-orange-500/50 bg-gradient-to-br from-gray-900/50 to-black/50 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {/* Gradient background on hover */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${stat.gradient}`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <p className="text-2xl md:text-3xl font-black mb-2 text-white">
                  {stat.value}
                </p>
                <p
                  className={`text-xs font-semibold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}
                >
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}