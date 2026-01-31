"use client";

import { MarketList } from "@/components/MarketList";
import { StatsOverview } from "@/components/StatsOverview";
import { Zap, Filter } from "lucide-react";
import { useState } from "react";

export default function MarketsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <section className="py-16 px-4 md:py-20 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-orange-400" />
              <span className="text-sm font-bold text-orange-400 tracking-widest">
                PREDICTION MARKETS
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                ALL MARKETS
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Browse and compete on Bitcoin-anchored prediction markets. 
              Every bet is trustless, every settlement is final.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <StatsOverview />
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 px-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-6 py-2 font-bold rounded-lg transition-all duration-300 ${
                  activeFilter === "all"
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                    : "border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-orange-400"
                }`}
              >
                ALL MARKETS
              </button>
              <button
                onClick={() => setActiveFilter("binary")}
                className={`px-6 py-2 font-bold rounded-lg transition-all duration-300 ${
                  activeFilter === "binary"
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                    : "border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-orange-400"
                }`}
              >
                BINARY
              </button>
              <button
                onClick={() => setActiveFilter("multi")}
                className={`px-6 py-2 font-bold rounded-lg transition-all duration-300 ${
                  activeFilter === "multi"
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                    : "border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-orange-400"
                }`}
              >
                MULTI-OUTCOME
              </button>
            </div>
          </div>
        </section>

        {/* Markets List */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <MarketList />
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl p-12 text-center backdrop-blur-sm hover:border-orange-500/60 transition-all duration-300">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Ready to Dominate?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Place your bets, track your positions, and climb the leaderboard.
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
                PLACE A BET
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap");

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        .font-black {
          font-family: "Orbitron", sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>
    </div>
  );
}