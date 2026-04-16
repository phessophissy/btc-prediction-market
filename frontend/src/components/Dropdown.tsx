"use client";

import { type ReactNode, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface DropdownProps {
  items: DropdownItem[];
  selected?: string;
  onSelect: (id: string) => void;
  placeholder?: string;
  className?: string;
}

export function Dropdown({ items, selected, onSelect, placeholder = "Select…", className = "" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  const current = items.find((i) => i.id === selected);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10
          bg-white/5 px-3 py-2.5 text-sm text-white transition-colors hover:bg-white/8"
      >
        <span className={current ? "text-white" : "text-white/40"}>
          {current ? (
            <span className="flex items-center gap-2">
              {current.icon}
              {current.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 animate-slide-down rounded-xl border border-white/10
          bg-[var(--surface-strong)] py-1 shadow-xl">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-white/8
                ${item.id === selected ? "text-amber-300" : "text-white/70 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
