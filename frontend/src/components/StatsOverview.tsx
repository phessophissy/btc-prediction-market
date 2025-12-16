"use client";

import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";

export function StatsOverview() {
  // These would be fetched from the contract in a real implementation
  const stats = [
    {
      label: "Total Markets",
      value: "24",
      icon: TrendingUp,
      change: "+3 this week",
    },
    {
      label: "Total Volume",
      value: "125,430 STX",
      icon: DollarSign,
      change: "+12.5%",
    },
    {
      label: "Active Users",
      value: "1,234",
      icon: Users,
      change: "+45 today",
    },
    {
      label: "Avg Settlement",
      value: "~10 min",
      icon: Clock,
      change: "Bitcoin finality",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card">
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
