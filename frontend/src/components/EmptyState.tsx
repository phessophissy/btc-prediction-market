interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="card p-8 text-center">
      <h3 className="mb-2 text-3xl">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}
