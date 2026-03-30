import { AlertCircle } from "lucide-react";

interface ConnectionRequiredProps {
  title: string;
  description: string;
}

export function ConnectionRequired({
  title,
  description,
}: ConnectionRequiredProps) {
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10">
        <AlertCircle className="h-8 w-8 text-amber-300" />
      </div>
      <h2 className="mb-2 text-3xl">{title}</h2>
      <p className="mx-auto max-w-xl text-slate-300">{description}</p>
    </div>
  );
}
