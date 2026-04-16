"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className = "" }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className={`divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.02] ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {item.title}
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="animate-slide-down px-5 pb-4 text-sm text-white/60">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
