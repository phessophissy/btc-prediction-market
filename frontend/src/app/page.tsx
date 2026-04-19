import { MarketList } from "@/components/MarketList";
import { CreateMarketButton } from "@/components/CreateMarketButton";
import { StatsOverview } from "@/components/StatsOverview";
import {
  ArrowRight,
  CircleDollarSign,
  Sparkles,
  TimerReset,
  Waves,
} from "lucide-react";
import { LiveNowPill } from "@/components/LiveNowPill";

export default function Home() {
  const highlights = [
    {
      title: "Bitcoin-settled outcomes",
      description: "Market resolution is anchored to BTC block data instead of app-side timers.",
      icon: TimerReset,
    },
    {
      title: "Expressive odds board",
      description: "Every market surfaces momentum, pool depth, and outcome color at a glance.",
      icon: Sparkles,
    },
    {
      title: "V3-compatible workflow",
      description: "Create markets on-chain today and monitor live contract state while trading functions are brought back in line with V3.",
      icon: CircleDollarSign,
    },
  ];
  const heroStats = [
    { label: "Studio mode", value: "Color-led" },
    { label: "Market lens", value: "Search + sort" },
    { label: "Resolution", value: "BTC block anchored" },
  ];

  return (
    <div className="space-y-8">
      <section className="hero-panel">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">Bitcoin finality. Studio polish.</span>
              <LiveNowPill />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl">
                Track the next BTC narrative with a brighter market studio.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                Create Bitcoin-anchored markets, inspect live contract state,
                and follow settlement timelines with a frontend that matches the
                currently deployed V3 contract.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CreateMarketButton />
              <a href="#active-markets" className="btn-secondary">
                Explore markets
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="glass-strip">
                <Waves className="h-4 w-4 text-sky-300" />
                Refined list controls
              </span>
              <span className="glass-strip">
                <CircleDollarSign className="h-4 w-4 text-amber-300" />
                Liquidity-led market cards
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel-highlight">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300">Why it feels better</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {highlights.map((item) => (
                <div key={item.title} className="panel-soft">
                  <item.icon className="mb-4 h-8 w-8 text-amber-300" />
                  <h2 className="mb-2 text-2xl">{item.title}</h2>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StatsOverview />

      <div className="glass-strip flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
        <span>The redesigned studio keeps the app bold without losing the market data hierarchy.</span>
        <span className="text-slate-400">Focused on readability, speed, and confidence.</span>
      </div>

      <section className="dashboard-grid">
        <div className="card">
          <span className="eyebrow mb-4">Workflow</span>
          <h2 className="section-title mb-3">A cleaner route from idea to settlement</h2>
          <p className="section-intro">
            Launch a market, monitor pool balance, and keep an eye on settlement timing with surfaces that are easier to scan under pressure.
          </p>
          <div className="mt-6 insight-list">
            {[
              "Use search and type filters to cut directly to the active market set you care about.",
              "Spot leading outcomes and liquidity concentration without opening each market in detail.",
              "Move from discovery into creation, portfolio review, or leaderboard context without losing the visual thread.",
              "Lean on brighter chips, strips, and badges that separate action states from passive information.",
            ].map((item) => (
              <div key={item} className="panel-soft text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="panel-highlight">
          <span className="eyebrow mb-4">What changed</span>
          <div className="space-y-4">
            <div className="panel-soft">
              <p className="text-sm text-slate-300">Theme direction</p>
              <p className="mt-2 text-2xl font-semibold text-white">Brighter, sharper, more editorial</p>
            </div>
            <div className="panel-soft">
              <p className="text-sm text-slate-300">Controls</p>
              <p className="mt-2 text-2xl font-semibold text-white">Search, filter, sort</p>
            </div>
            <div className="panel-soft">
              <p className="text-sm text-slate-300">Cards</p>
              <p className="mt-2 text-2xl font-semibold text-white">Momentum, liquidity, urgency</p>
            </div>
          </div>
        </div>
      </section>

      <section id="active-markets" className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow mb-3">Live order flow</span>
            <h2 className="section-title">Active markets</h2>
            <p className="max-w-2xl text-slate-300">
              Filter through binary and multi-outcome markets with richer pool
              visuals and cleaner wallet actions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="glass-strip text-sm text-slate-200">Built-in search</span>
            <span className="glass-strip text-sm text-slate-200">Instant filtering</span>
            <span className="glass-strip text-sm text-slate-200">Pool-based sorting</span>
          </div>
        </div>
        <MarketList />
      </section>
    </div>
  );
}

// [fix/token-decimal-precision] commit 5/10: refine pages layer – 1776638467677482976
