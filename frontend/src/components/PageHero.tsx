import { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
  compact?: boolean;
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <section className={`hero-panel ${compact ? "py-8" : ""}`}>
      {eyebrow ? <span className="eyebrow mb-4">{eyebrow}</span> : null}
      <h1 className="mb-3 text-5xl">{title}</h1>
      <p className="max-w-2xl text-slate-300">{description}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
