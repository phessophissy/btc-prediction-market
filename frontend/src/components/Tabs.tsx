"use client";

import { type ReactNode, useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, className = "", onChange }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id ?? "");

  function select(id: string) {
    setActiveId(id);
    onChange?.(id);
  }

  const active = tabs.find((t) => t.id === activeId);

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 rounded-xl bg-white/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeId}
            onClick={() => select(tab.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors
              ${
                tab.id === activeId
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-4">
        {active?.content}
      </div>
    </div>
  );
}
