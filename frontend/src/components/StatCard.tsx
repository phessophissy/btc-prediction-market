import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  detail?: string;
  icon?: LucideIcon;
  accentClassName?: string;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  accentClassName = "text-amber-300",
  loading = false,
}: StatCardProps) {
  return (
    <div className={`card relative overflow-hidden ${loading ? "animate-pulse" : ""}`}>
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-300">{label}</p>
          <div className="metric-value mt-3 text-4xl">{value}</div>
          {detail ? (
            <p className={`mt-3 text-xs uppercase tracking-[0.18em] ${accentClassName}`}>
              {detail}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
            <Icon className={`h-8 w-8 ${accentClassName}`} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
