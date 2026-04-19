import Link from "next/link";
import { ArrowUpRight, Bitcoin, ShieldCheck, Waves } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Markets" },
  { href: "/create", label: "Create" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="relative mt-12">
      <div className="card overflow-hidden px-6 py-8 sm:px-8">
        <div className="spotlight-orb -left-12 top-0 h-32 w-32 bg-amber-300/15" />
        <div className="spotlight-orb bottom-0 right-0 h-36 w-36 bg-sky-300/15" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-300/25 via-rose-400/20 to-sky-400/25">
                <Bitcoin className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">BTC Predict Studio</p>
                <p className="text-sm text-slate-300">
                  Bright market intelligence for Bitcoin-settled outcomes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="glass-strip">
                <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-300" />
                Stacks wallet flow
              </span>
              <span className="glass-strip">
                <Waves className="mr-2 inline h-4 w-4 text-sky-300" />
                Liquidity-first market board
              </span>
              <span className="glass-strip">
                <ArrowUpRight className="mr-2 inline h-4 w-4 text-amber-300" />
                BTC block settlement visibility
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="panel-soft group flex items-center justify-between">
                <span className="font-medium text-white">{link.label}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-amber-300" />
              </Link>
            ))}
          </div>
        </div>

        <div className="relative mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm text-slate-400">
          <span>BTC Predict Studio</span>
          <span>Colorful interface refresh for Bitcoin-settled markets.</span>
        </div>
      </div>
    </footer>
  );
}

// [fix/api-timeout-retry] commit 2/10: improve ui layer – 1776638488348631862
