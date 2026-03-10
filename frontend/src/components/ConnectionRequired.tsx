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
      <AlertCircle className="mx-auto mb-4 h-16 w-16 text-amber-300" />
      <h2 className="mb-2 text-3xl">{title}</h2>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}
