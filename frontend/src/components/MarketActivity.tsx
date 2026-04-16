"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { truncateAddress, relativeTime } from "../lib/formatters";

interface ActivityItem {
  id: string;
  user: string;
  action: "bet" | "create" | "settle" | "claim";
  marketTitle: string;
  amount?: number;
  outcome?: string;
  timestamp: number;
}

interface MarketActivityProps {
  activities: ActivityItem[];
  className?: string;
}

const actionLabels: Record<ActivityItem["action"], string> = {
  bet: "placed a bet on",
  create: "created market",
  settle: "settled market",
  claim: "claimed winnings from",
};

const actionColors: Record<ActivityItem["action"], string> = {
  bet: "text-sky-300",
  create: "text-amber-300",
  settle: "text-emerald-300",
  claim: "text-violet-300",
};

export function MarketActivity({ activities, className = "" }: MarketActivityProps) {
  if (activities.length === 0) return null;

  return (
    <section className={`panel-soft p-5 ${className}`}>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        <ArrowUpRight className="h-4 w-4 text-sky-400" />
        Recent Activity
      </h3>
      <ul className="space-y-3">
        {activities.map((item) => (
          <li key={item.id} className="flex items-start gap-3 text-sm">
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-white/40">
              {item.user.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/70">
                <span className="font-medium text-white/90">
                  {truncateAddress(item.user)}
                </span>{" "}
                <span className={actionColors[item.action]}>
                  {actionLabels[item.action]}
                </span>{" "}
                <span className="font-medium text-white/80">{item.marketTitle}</span>
                {item.outcome && (
                  <span className="text-white/50"> ({item.outcome})</span>
                )}
                {item.amount !== undefined && (
                  <span className="text-white/50">
                    {" "}
                    — {(item.amount / 1_000_000).toFixed(2)} STX
                  </span>
                )}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-white/30">
                <Clock className="h-3 w-3" />
                {relativeTime(item.timestamp)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
