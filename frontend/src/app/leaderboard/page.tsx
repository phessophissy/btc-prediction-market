"use client";

import { Trophy, Medal, Award } from "lucide-react";

export default function LeaderboardPage() {
  // Mock data - in production, fetch from contract/indexer
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="w-6 text-center font-bold text-gray-500">{rank}</span>;
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* 2nd Place */}
        <div className="bg-gray-800 rounded-xl p-6 text-center mt-8">
          <Medal className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">2nd</p>
          <p className="text-sm text-gray-400 mb-2">{formatAddress(leaderboard[1].address)}</p>
          <p className="text-xl font-bold text-green-500">{leaderboard[1].winnings.toLocaleString()} STX</p>
          <p className="text-xs text-gray-500">{leaderboard[1].winRate}% win rate</p>
        </div>

        {/* 1st Place */}
        <div className="bg-gradient-to-b from-yellow-900/30 to-gray-800 rounded-xl p-6 text-center border border-yellow-600">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
          <p className="text-3xl font-bold">1st</p>
          <p className="text-sm text-gray-400 mb-2">{formatAddress(leaderboard[0].address)}</p>
          <p className="text-2xl font-bold text-green-500">{leaderboard[0].winnings.toLocaleString()} STX</p>
          <p className="text-xs text-gray-500">{leaderboard[0].winRate}% win rate</p>
        </div>

        {/* 3rd Place */}
        <div className="bg-gray-800 rounded-xl p-6 text-center mt-8">
          <Award className="w-12 h-12 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">3rd</p>
          <p className="text-sm text-gray-400 mb-2">{formatAddress(leaderboard[2].address)}</p>
          <p className="text-xl font-bold text-green-500">{leaderboard[2].winnings.toLocaleString()} STX</p>
          <p className="text-xs text-gray-500">{leaderboard[2].winRate}% win rate</p>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Top Predictors</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Address</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Total Won</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Bets</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {leaderboard.map((user) => (
                <tr key={user.rank} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-sm">
                    {formatAddress(user.address)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-green-500">
                    {user.winnings.toLocaleString()} STX
                  </td>
                  <td className="px-4 py-4 text-right text-gray-400">
                    {user.bets}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.winRate >= 70 ? "bg-green-500/20 text-green-400" :
                      user.winRate >= 50 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {user.winRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
