"use client";

import { PageHero } from "@/components/PageHero";
import { formatAddress } from "@/lib/format";
import { Award, Medal, Trophy } from "lucide-react";

export default function LeaderboardPage() {
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

  const podium = [
    {
      label: "2nd",
      user: leaderboard[1],
      icon: Medal,
      iconClass: "text-slate-300",
      panelClass: "card mt-6",
    },
    {
      label: "1st",
      user: leaderboard[0],
      icon: Trophy,
      iconClass: "text-amber-300",
      panelClass:
        "hero-panel border-amber-300/20 bg-gradient-to-br from-amber-300/14 via-rose-300/10 to-sky-300/10",
    },
    {
      label: "3rd",
      user: leaderboard[2],
      icon: Award,
      iconClass: "text-orange-300",
      panelClass: "card mt-6",
    },
  ];
  const totals = {
    totalWinnings: leaderboard.reduce((sum, user) => sum + user.winnings, 0),
    averageWinRate: Math.round(
      leaderboard.reduce((sum, user) => sum + user.winRate, 0) / leaderboard.length
    ),
    totalBets: leaderboard.reduce((sum, user) => sum + user.bets, 0),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHero
        eyebrow="Top traders"
        title="Leaderboard"
        description="Highlight the most accurate wallets, strongest win rates, and the biggest STX earners in a brighter ranking view."
        compact
      >
        <div className="flex flex-wrap gap-3">
          <span className="glass-strip text-sm text-slate-200">Podium spotlight</span>
          <span className="glass-strip text-sm text-slate-200">Readable wallet ranks</span>
          <span className="glass-strip text-sm text-slate-200">Win-rate badges</span>
        </div>
      </PageHero>

      <section className="grid gap-4 md:grid-cols-3 md:items-end">
        {podium.map((entry) => {
          const Icon = entry.icon;
          return (
            <div key={entry.label} className={`${entry.panelClass} p-6 text-center`}>
              <Icon className={`mx-auto mb-3 h-12 w-12 ${entry.iconClass}`} />
              <p className="mb-2 text-3xl">{entry.label}</p>
              <p className="mb-2 text-sm text-slate-300">{formatAddress(entry.user.address)}</p>
              <p className="text-2xl font-semibold text-emerald-300">
                {entry.user.winnings.toLocaleString()} STX
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                {entry.user.winRate}% win rate
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Tracked winnings</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">
            {totals.totalWinnings.toLocaleString()} STX
          </p>
        </div>
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Average hit rate</p>
          <p className="mt-2 text-3xl font-semibold text-sky-300">{totals.averageWinRate}%</p>
        </div>
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Bets recorded</p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">{totals.totalBets}</p>
        </div>
      </section>

      <div className="glass-strip flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
        <span>Podium cards emphasize the best overall performance while the table below keeps the full field visible.</span>
        <span className="text-slate-400">Win-rate badges update per row threshold.</span>
      </div>

      <section className="table-shell">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-3xl">Top predictors</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-white/6 text-left text-sm text-slate-300">
              <tr>
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Address</th>
                <th className="px-6 py-4 text-right font-medium">Total Won</th>
                <th className="px-6 py-4 text-right font-medium">Bets</th>
                <th className="px-6 py-4 text-right font-medium">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {leaderboard.map((user) => {
                const winRateClass =
                  user.winRate >= 70
                    ? "status-positive"
                    : user.winRate >= 50
                      ? "status-warning"
                      : "status-negative";
                const rowClass =
                  user.rank === 1
                    ? "bg-amber-300/8"
                    : user.rank === 2
                      ? "bg-sky-300/6"
                      : user.rank === 3
                        ? "bg-rose-300/6"
                        : "";

                return (
                  <tr key={user.rank} className={`transition hover:bg-white/6 ${rowClass}`}>
                    <td className="px-6 py-5 text-white">{user.rank}</td>
                    <td className="px-6 py-5 font-mono text-sm text-slate-200">
                      {formatAddress(user.address)}
                    </td>
                    <td className="px-6 py-5 text-right font-semibold text-emerald-300">
                      {user.winnings.toLocaleString()} STX
                    </td>
                    <td className="px-6 py-5 text-right text-slate-300">{user.bets}</td>
                    <td className="px-6 py-5 text-right">
                      <span className={`pill ${winRateClass}`}>{user.winRate}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
