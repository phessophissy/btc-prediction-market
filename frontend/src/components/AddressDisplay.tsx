"use client";

import { Check, Copy } from "lucide-react";
import { formatAddress } from "@/lib/format";
import { useClipboard } from "@/hooks/useClipboard";

interface AddressDisplayProps {
  address: string;
  full?: boolean;
  className?: string;
}

export function AddressDisplay({ address, full = false, className = "" }: AddressDisplayProps) {
  const { copy, copied } = useClipboard();

  return (
    <button
      onClick={() => copy(address)}
      title={copied ? "Copied!" : `Copy ${address}`}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-sm transition hover:border-amber-300/25 hover:bg-white/8 ${className}`}
    >
      <span className="text-slate-300">{full ? address : formatAddress(address)}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-300" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-slate-400" />
      )}
    </button>
  );
}
