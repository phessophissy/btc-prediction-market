import { MarketList } from "@/components/MarketList";
import { CreateMarketButton } from "@/components/CreateMarketButton";
import { StatsOverview } from "@/components/StatsOverview";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-bitcoin">Bitcoin</span>-Anchored{" "}
          <span className="text-stacks">Prediction Market</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Predict outcomes and win rewards. Markets settle trustlessly using
          Bitcoin block hashes for provably fair randomness.
        </p>
        <CreateMarketButton />
      </section>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Active Markets */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Active Markets</h2>
          <div className="flex gap-2">
            <button className="btn-primary text-sm">All</button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 px-4 rounded-lg">
              Binary
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 px-4 rounded-lg">
              Multi-outcome
            </button>
          </div>
        </div>
        <MarketList />
      </section>
    </div>
  );
}
