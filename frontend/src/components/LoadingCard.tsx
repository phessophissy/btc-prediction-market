interface LoadingCardProps {
  lines?: number;
}

export function LoadingCard({ lines = 3 }: LoadingCardProps) {
  return (
    <div className="card animate-pulse">
      <div className="mb-4 h-3 w-24 rounded-full bg-sky-300/15" />
      <div className="mb-4 h-7 w-3/4 rounded-full bg-white/10" />
      <div className="mb-6 h-4 w-1/2 rounded-full bg-white/10" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="h-5 rounded-full bg-white/8" />
        ))}
      </div>
    </div>
  );
}
