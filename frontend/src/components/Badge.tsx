import { type ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "muted";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  success: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  warning: "border-orange-400/20 bg-orange-500/10 text-orange-200",
  danger: "border-rose-400/20 bg-rose-500/10 text-rose-200",
  info: "border-sky-400/20 bg-sky-500/10 text-sky-200",
  muted: "border-white/10 bg-white/5 text-white/50",
};

export function Badge({ children, variant = "default", dot = false, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {dot && (
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${
          variant === "success" ? "bg-emerald-400" :
          variant === "warning" ? "bg-orange-400" :
          variant === "danger" ? "bg-rose-400" :
          variant === "info" ? "bg-sky-400" :
          variant === "muted" ? "bg-white/30" :
          "bg-amber-400"
        }`} />
      )}
      {children}
    </span>
  );
}
