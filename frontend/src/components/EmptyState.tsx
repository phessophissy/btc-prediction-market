import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-sky-300/20 bg-sky-300/10">
        <Sparkles className="h-7 w-7 text-sky-300" />
      </div>
      <h3 className="mb-2 text-3xl">{title}</h3>
      <p className="mx-auto max-w-xl text-slate-300">{description}</p>
    </div>
  );
}
