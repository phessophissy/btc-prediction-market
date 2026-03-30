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
      </section>

      <StatsOverview />

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
            <button className="btn-primary text-sm">All markets</button>
            <button className="btn-secondary text-sm">
              Binary
            </button>
            <button className="btn-secondary text-sm">
              Multi-outcome
            </button>
          </div>
        </div>
        <MarketList />
      </section>
    </div>
  );
}
