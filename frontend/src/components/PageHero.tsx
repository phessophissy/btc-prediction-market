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
      <div className="spotlight-orb -right-10 top-0 h-32 w-32 bg-amber-300/10" />
      <div className="spotlight-orb bottom-0 left-0 h-28 w-28 bg-sky-300/10" />
      <div className="relative space-y-4">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <div className="space-y-3">
          <h1 className="text-5xl">{title}</h1>
          <p className="max-w-2xl text-slate-300">{description}</p>
        </div>
        {children ? <div className="pt-2">{children}</div> : null}
      </div>
    </section>
  );
}
