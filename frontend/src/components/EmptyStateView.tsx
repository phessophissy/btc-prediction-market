import { type LucideIcon, Inbox } from "lucide-react";
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-center ${className}`}>
      <div className="rounded-full bg-white/5 p-4">
        <Icon className="h-8 w-8 text-white/25" />
      </div>
      <h3 className="text-lg font-semibold text-white/80">{title}</h3>
      {description && <p className="max-w-sm text-sm text-white/40">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
