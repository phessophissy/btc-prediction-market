interface LoadingCardProps {
  lines?: number;
}

export function LoadingCard({ lines = 3 }: LoadingCardProps) {
  return (
    <div className="card animate-pulse">
      <div className="mb-4 flex items-center gap-3">
        <div className="skeleton-shimmer h-8 w-24 rounded-full" />
        <div className="skeleton-shimmer h-6 w-16 rounded-full" />
      </div>
      <div className="skeleton-shimmer mb-3 h-8 w-3/4 rounded-xl" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton-shimmer h-4 rounded-lg"
            style={{ width: `${85 - i * 12}%`, animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <div className="skeleton-shimmer h-10 flex-1 rounded-full" />
        <div className="skeleton-shimmer h-10 flex-1 rounded-full" />
      </div>
    </div>
  );
}
