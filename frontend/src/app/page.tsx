"use client";

import { useState, useEffect } from "react";
import { MarketList } from "@/components/MarketList";
import { CreateMarketButton } from "@/components/CreateMarketButton";
import { StatsOverview } from "@/components/StatsOverview";
import { TrendingUp, Zap, Target, Lock } from "lucide-react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />
        {/* Glow effect following mouse */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl transition-all duration-100"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            pointerEvents: "none",
          }}
        />
        {/* Static accent glow */}
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-600/30 to-red-600/30 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 border border-orange-500/30 rounded-full bg-orange-500/5 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-300 font-medium">Live Prediction Market</span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none max-w-6xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-600">
              PREDICT
            </span>
            <span className="block text-white mt-2">THE FUTURE</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light tracking-wide">
            Bitcoin-anchored prediction markets with trustless settlement. 
            Compete. Win. Dominate.
          </p>

          {/* CTA Button */}
          <div className="mb-16 flex gap-4 justify-center">
            <CreateMarketButton />
            <button className="px-8 py-4 border-2 border-gray-600 hover:border-orange-500 text-white hover:text-orange-400 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 text-lg">
              EXPLORE MARKETS
            </button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-20">
            {[
              {
                icon: Target,
                title: "Provably Fair",
                desc: "Bitcoin block hashes = guaranteed randomness",
              },
              {
                icon: Lock,
                title: "Trustless",
                desc: "Smart contracts settle automatically",
              },
              {
                icon: TrendingUp,
                title: "High Rewards",
                desc: "Up to 2x your bet on winning outcomes",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 border border-gray-800 hover:border-orange-500/50 bg-gray-900/50 hover:bg-gray-900/80 rounded-xl transition-all duration-300 backdrop-blur-sm group"
              >
                <feature.icon className="w-8 h-8 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                NETWORK STATS
              </span>
            </h2>
            <StatsOverview />
          </div>
        </section>

        {/* Markets Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-black">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  ACTIVE MARKETS
                </span>
              </h2>
              <div className="hidden md:flex gap-2">
                <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all duration-300 text-sm">
                  ALL
                </button>
                <button className="px-6 py-2 border border-gray-700 hover:border-orange-500 text-white hover:text-orange-400 font-bold rounded-lg transition-all duration-300 text-sm">
                  BINARY
                </button>
                <button className="px-6 py-2 border border-gray-700 hover:border-orange-500 text-white hover:text-orange-400 font-bold rounded-lg transition-all duration-300 text-sm">
                  MULTI
                </button>
              </div>
            </div>

            {/* Markets List */}
            <MarketList />
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-20 px-4 mb-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="border-2 border-orange-500/30 bg-orange-500/5 rounded-2xl p-12 backdrop-blur-sm hover:border-orange-500/60 hover:bg-orange-500/10 transition-all duration-300">
              <h3 className="text-3xl md:text-4xl font-black mb-4">Ready to Compete?</h3>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Create your first market, place your bets, and join thousands of predictors competing for rewards.
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
                START BETTING NOW
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap");

        * {
          font-family: "Space Grotesk", sans-serif;
        }

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

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #dc2626);
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #fb923c, #ef4444);
        }

        /* Smooth animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        section {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}