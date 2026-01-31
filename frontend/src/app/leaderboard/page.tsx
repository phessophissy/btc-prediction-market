"use client";

import { Trophy, Medal, Award, Flame, TrendingUp, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function LeaderboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("all-time");
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  // Mock data
  const leaderboard = [
    { rank: 1, address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7", winnings: 15420, bets: 89, winRate: 72 },
    { rank: 2, address: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE", winnings: 12350, bets: 156, winRate: 65 },
    { rank: 3, address: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE", winnings: 9870, bets: 45, winRate: 78 },
    { rank: 4, address: "SP31G2FZ5JN87BATZMP4ZRYE5F7WZQDNEXJ7G7X97", winnings: 8540, bets: 67, winRate: 61 },
    { rank: 5, address: "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR", winnings: 7200, bets: 112, winRate: 58 },
    { rank: 6, address: "SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB", winnings: 5680, bets: 34, winRate: 82 },
    { rank: 7, address: "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1", winnings: 4920, bets: 78, winRate: 54 },
    { rank: 8, address: "SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C", winnings: 3450, bets: 23, winRate: 70 },
    { rank: 9, address: "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9", winnings: 2890, bets: 91, winRate: 49 },
    { rank: 10, address: "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR", winnings: 2340, bets: 56, winRate: 52 },
  ];

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const PodiumCard = ({ rank, user, delay }) => {
    const podiumHeights = { 1: "h-48", 2: "h-40", 3: "h-44" };
    const podiumColors = {
      1: "from-yellow-500/30 to-orange-600/30 border-yellow-500/50",
      2: "from-gray-500/20 to-slate-600/20 border-gray-500/40",
      3: "from-orange-700/30 to-red-700/30 border-orange-700/50",
    };

    const icons = {
      1: <Trophy className="w-12 h-12 text-yellow-400" />,
      2: <Medal className="w-10 h-10 text-gray-300" />,
      3: <Award className="w-10 h-10 text-orange-400" />,
    };

    return (
      <div
        className={`flex flex-col items-center gap-4 ${animateCards ? "animate-in fade-in slide-in-from-bottom-4" : ""}`}
        style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
      >
        {/* Podium */}
        <div className={`w-full ${podiumHeights[rank]} rounded-t-2xl border-2 border-b-0 ${podiumColors[rank]} bg-gradient-to-b from-gray-900/50 to-black/50 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-opacity-100 transition-all`}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-center mb-3">{icons[rank]}</div>
            <div className="text-4xl font-black text-white text-center">{rank === 1 ? "🏆" : rank === 2 ? "🥈" : "🥉"}</div>
          </div>
        </div>

        {/* Card */}
        <div className="w-full border-2 border-t-0 border-gray-700/50 rounded-b-2xl bg-gradient-to-b from-gray-900/80 to-black/80 p-6 hover:border-orange-500/50 transition-all">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rank #{rank}</div>
            <p className="text-sm font-mono text-gray-400 break-all">{formatAddress(user.address)}</p>
            <div className="pt-3 space-y-1">
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                {user.winnings.toLocaleString()} STX
              </p>
              <p className="text-xs text-gray-500">{user.winRate}% win rate • {user.bets} bets</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-black to-black" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-r from-orange-600/15 to-red-600/15 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <section className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flame className="w-8 h-8 text-orange-500" />
            <span className="text-sm font-black text-orange-400 tracking-widest uppercase">Competitive Ranking</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">
              LEADERBOARD
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The top Bitcoin prediction market competitors. Compete for glory, winnings, and bragging rights.
          </p>
        </section>

        {/* Timeframe Selector */}
        <div className="flex items-center justify-center gap-3 mb-16 flex-wrap">
          {[
            { value: "all-time", label: "All Time" },
            { value: "monthly", label: "This Month" },
            { value: "weekly", label: "This Week" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedTimeframe(option.value)}
              className={`px-6 py-2 font-bold rounded-lg transition-all duration-300 ${
                selectedTimeframe === option.value
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/40"
                  : "border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-orange-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Podium */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <PodiumCard rank={2} user={leaderboard[1]} delay={100} />
            <PodiumCard rank={1} user={leaderboard[0]} delay={0} />
            <PodiumCard rank={3} user={leaderboard[2]} delay={200} />
          </div>
        </section>

        {/* Leaderboard Table */}
        <section className="border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-orange-500/30 transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500/10 to-red-600/10 border-b border-gray-800 px-6 py-4">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <span>Top Competitors</span>
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-400 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-400 uppercase tracking-wider">Total Won</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-400 uppercase tracking-wider">Bets</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-400 uppercase tracking-wider">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {leaderboard.map((user, idx) => (
                  <tr
                    key={user.rank}
                    className={`hover:bg-gray-900/50 transition-all duration-300 group ${animateCards ? "animate-in fade-in" : ""}`}
                    style={{ animationDelay: `${300 + idx * 50}ms`, animationFillMode: "both" }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {user.rank <= 3 ? (
                          [
                            <Trophy key="trophy" className="w-5 h-5 text-yellow-500" />,
                            <Medal key="medal" className="w-5 h-5 text-gray-400" />,
                            <Award key="award" className="w-5 h-5 text-orange-600" />,
                          ][user.rank - 1]
                        ) : (
                          <span className="w-5 text-center font-bold text-gray-500">{user.rank}</span>
                        )}
                        <span className="font-black text-lg text-white group-hover:text-orange-400 transition-colors">
                          #{user.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm text-gray-300 group-hover:text-orange-400 transition-colors">
                        {formatAddress(user.address)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                        {user.winnings.toLocaleString()} STX
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-gray-400 font-semibold">{user.bets}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span
                        className={`px-3 py-1 rounded-lg font-bold text-sm ${
                          user.winRate >= 70
                            ? "bg-green-500/20 text-green-400"
                            : user.winRate >= 50
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {user.winRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="border-2 border-orange-500/30 rounded-2xl bg-gradient-to-br from-orange-500/5 to-red-600/5 p-12 hover:border-orange-500/60 transition-all">
            <Zap className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-black mb-3">Join the Competition</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Start betting today and climb your way to the top of the leaderboard.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
              Start Betting
            </button>
          </div>
        </section>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap");

        h1,
        h2,
        h3,
        .font-black {
          font-family: "Orbitron", sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>
    </div>
  );
}