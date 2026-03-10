import { MarketList } from "@/components/MarketList";
import { CreateMarketButton } from "@/components/CreateMarketButton";
import { StatsOverview } from "@/components/StatsOverview";
import { ArrowRight, CircleDollarSign, Sparkles, TimerReset } from "lucide-react";

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
      title: "STX-native payouts",
      description: "Create markets, bet across outcomes, and claim winnings directly from your wallet.",
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="hero-panel">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <span className="eyebrow">Bitcoin finality. Arcade color.</span>
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl">
                Trade the next BTC narrative with a brighter market board.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                Predict outcomes, watch pools shift in real time, and settle
                against Bitcoin block data with a frontend that finally looks
                alive.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CreateMarketButton />
              <a href="#active-markets" className="btn-secondary">
                Explore markets
                <ArrowRight className="h-4 w-4" />
              </a>
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
