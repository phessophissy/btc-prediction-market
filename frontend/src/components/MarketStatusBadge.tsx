import { CheckCircle, Clock, Flame, Gavel, Lock } from "lucide-react";

type MarketStatus = "active" | "closing-soon" | "settleable" | "settled" | "expired";

interface MarketStatusBadgeProps {
  settled: boolean;
  blocksRemaining: number;
  canSettle?: boolean;
}

export function getMarketStatus({ settled, blocksRemaining, canSettle }: MarketStatusBadgeProps): MarketStatus {
  if (settled) return "settled";
  if (canSettle) return "settleable";
  if (blocksRemaining <= 0) return "expired";
  if (blocksRemaining <= 6) return "closing-soon";
  return "active";
}

const statusConfig = {
  active: {
    label: "Active",
    icon: Clock,
    className: "border-sky-400/25 bg-sky-500/10 text-sky-200",
  },
  "closing-soon": {
    label: "Closing soon",
    icon: Flame,
    className: "border-amber-400/25 bg-amber-500/10 text-amber-200",
  },
  settleable: {
    label: "Ready to settle",
    icon: Gavel,
    className: "border-emerald-400/25 bg-emerald-500/10 text-emerald-200",
  },
  settled: {
    label: "Settled",
    icon: CheckCircle,
    className: "border-slate-400/25 bg-slate-500/10 text-slate-300",
  },
  expired: {
    label: "Awaiting settlement",
    icon: Lock,
    className: "border-violet-400/25 bg-violet-500/10 text-violet-200",
  },
};

export function MarketStatusBadge(props: MarketStatusBadgeProps) {
  const status = getMarketStatus(props);
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`pill ${config.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
