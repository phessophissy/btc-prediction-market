"use client";

import { Link2, Share2, Twitter } from "lucide-react";
import { useState } from "react";
import { useClipboard } from "@/hooks/useClipboard";

interface ShareMarketProps {
  marketId: number;
  title: string;
}

export function ShareMarket({ marketId, title }: ShareMarketProps) {
  const [open, setOpen] = useState(false);
  const { copy, copied } = useClipboard();

  const marketUrl = typeof window !== "undefined"
    ? `${window.location.origin}/markets?id=${marketId}`
    : "";

  const tweetText = encodeURIComponent(`Check out this BTC prediction market: "${title}" on BTC Predict Studio 🔮\n${marketUrl}`);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-ghost px-2 py-2 text-slate-400 hover:text-amber-300"
        aria-label="Share market"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-lg">
            <button
              onClick={() => { copy(marketUrl); setOpen(false); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
            >
              <Link2 className="h-4 w-4" />
              {copied ? "Copied!" : "Copy link"}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${tweetText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <Twitter className="h-4 w-4" />
              Share on X
            </a>
          </div>
        </>
      )}
    </div>
  );
}
