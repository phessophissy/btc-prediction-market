"use client";

import { useEffect, useState } from "react";
import { useStacksAuth } from "@/contexts/StacksAuthContext";
import {
  Clock,
  Gift,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { ConnectionRequired } from "@/components/ConnectionRequired";
import { PageHero } from "@/components/PageHero";
import { StatCard } from "@/components/StatCard";
import {
  Market,
  UserPosition,
  UserStats,
  canClaimWinnings,
  formatSTX,
  getOutcomeLabel,
  getUserPositions,
  getUserStats,
} from "@/lib/contractService";
import {
  CONTRACT_ADDRESS,
  CONTRACT_CAPABILITIES,
  CONTRACT_NAME,
  OUTCOME_A,
  OUTCOME_B,
  OUTCOME_C,
  OUTCOME_D,
} from "@/lib/constants";
import { openContractCall } from "@stacks/connect";
import { PostConditionMode, uintCV } from "@stacks/transactions";

interface PositionWithMarket {
  position: UserPosition;
  market: Market;
  canClaim: boolean;
  isWinner: boolean;
}

export default function PortfolioPage() {
  const { isConnected, stxAddress, network } = useStacksAuth();
  const [positions, setPositions] = useState<PositionWithMarket[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "won" | "lost" | "claimed">("all");

  useEffect(() => {
    async function loadPortfolio() {
      if (!stxAddress) return;

      try {
        setLoading(true);
        const [userPositions, userStats] = await Promise.all([
          getUserPositions(stxAddress),
          getUserStats(stxAddress),
        ]);

        const positionsWithClaim = await Promise.all(
          userPositions.map(async ({ position, market }) => {
            const claimable = await canClaimWinnings(market.id, stxAddress);
            const isWinner =
              market.settled &&
              market.winningOutcome !== null &&
              ((market.winningOutcome === OUTCOME_A && position.outcomeAAmount > 0) ||
                (market.winningOutcome === OUTCOME_B && position.outcomeBAmount > 0) ||
                (market.winningOutcome === OUTCOME_C && position.outcomeCAmount > 0) ||
                (market.winningOutcome === OUTCOME_D && position.outcomeDAmount > 0));

            return { position, market, canClaim: claimable, isWinner };
          })
        );

        setPositions(positionsWithClaim);
        setStats(userStats);
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, [stxAddress]);

  const handleClaimWinnings = async (marketId: number) => {
    if (!stxAddress) return;

    setClaiming(marketId);
    try {
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "claim-winnings",
        functionArgs: [uintCV(marketId)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log("Claim transaction submitted:", data);
          setTimeout(() => window.location.reload(), 2000);
        },
        onCancel: () => setClaiming(null),
      });
    } catch (error) {
      console.error("Failed to claim winnings:", error);
      setClaiming(null);
    }
  };

  const getPositionOutcome = (position: UserPosition) => {
    const outcomes = [];
    if (position.outcomeAAmount > 0) outcomes.push(`A: ${formatSTX(position.outcomeAAmount)}`);
    if (position.outcomeBAmount > 0) outcomes.push(`B: ${formatSTX(position.outcomeBAmount)}`);
    if (position.outcomeCAmount > 0) outcomes.push(`C: ${formatSTX(position.outcomeCAmount)}`);
    if (position.outcomeDAmount > 0) outcomes.push(`D: ${formatSTX(position.outcomeDAmount)}`);
    return outcomes.join(", ");
  };

  const getPositionStatus = (pm: PositionWithMarket): "active" | "won" | "lost" | "claimed" => {
    if (pm.position.claimed) return "claimed";
    if (!pm.market.settled) return "active";
    return pm.isWinner ? "won" : "lost";
  };

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-4xl">
        <ConnectionRequired
          title="Connect Wallet"
          description="Please connect your Stacks wallet to view your portfolio."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="hero-panel animate-pulse py-10">
          <div className="mb-4 h-5 w-28 rounded-full bg-white/10" />
          <div className="mb-4 h-12 w-72 rounded-full bg-white/10" />
          <div className="h-5 w-2/3 rounded-full bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card animate-pulse">
              <div className="mb-3 h-4 w-1/2 rounded-full bg-white/10" />
              <div className="h-10 w-3/4 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
        <div className="card animate-pulse">
          <div className="mb-5 h-6 w-1/3 rounded-full bg-white/10" />
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-20 rounded-[1.25rem] bg-white/8" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activePositions = positions.filter((position) => !position.market.settled).length;
  const wonPositions = positions.filter((position) => getPositionStatus(position) === "won").length;
  const claimedPositions = positions.filter((position) => position.position.claimed).length;
  const visiblePositions = positions.filter((position) =>
    statusFilter === "all" ? true : getPositionStatus(position) === statusFilter
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHero
        eyebrow="Wallet dashboard"
        title="My portfolio"
        description={
          CONTRACT_CAPABILITIES.claimWinnings
            ? "Track open positions, spot settled winners, and claim payouts without digging through flat tables."
            : "Review tracked positions and derived outcomes. Claim actions stay hidden until the V3 contract exposes them."
        }
        compact
      >
        <div className="flex flex-wrap gap-3">
          <span className="glass-strip text-sm text-slate-200">Position summary</span>
          <span className="glass-strip text-sm text-slate-200">Claim readiness</span>
          <span className="glass-strip text-sm text-slate-200">Color-coded statuses</span>
        </div>
      </PageHero>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Bets Placed" value={stats?.totalBetsPlaced || 0} />
        <StatCard
          label="Total Winnings"
          value={<span className="text-emerald-300">{formatSTX(stats?.totalWinnings || 0)} STX</span>}
        />
        <StatCard label="Active Positions" value={activePositions} />
        <StatCard
          label="Markets Created"
          value={<span className="text-amber-300">{stats?.marketsCreated || 0}</span>}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Winning positions</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-300">{wonPositions}</p>
        </div>
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Claimed markets</p>
          <p className="mt-3 text-3xl font-semibold text-sky-300">{claimedPositions}</p>
        </div>
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Pending rewards</p>
          <p className="mt-3 text-3xl font-semibold text-amber-300">
            {positions.filter((position) => position.canClaim).length}
          </p>
        </div>
      </section>

      <div className="glass-strip flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
        <span>
          {activePositions} active positions, {wonPositions} winning outcomes, {claimedPositions} claimed payouts.
        </span>
        <span className="text-slate-400">Switch filters to focus the table below.</span>
      </div>

      <div className="card">
        <p className="mb-3 text-sm text-slate-300">Filter positions by result state</p>
        <div className="flex flex-wrap gap-2">
          {[
            "all",
            "active",
            "won",
            "lost",
            "claimed",
          ].map((status) => (
            <button
              key={status}
              type="button"
              data-active={statusFilter === status}
              onClick={() => setStatusFilter(status as typeof statusFilter)}
              className="btn-pill"
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {CONTRACT_CAPABILITIES.claimWinnings && positions.some((position) => position.canClaim) && (
        <div className="card flex items-center gap-3 border-emerald-300/20 bg-emerald-300/10">
          <Gift className="h-6 w-6 text-emerald-300" />
          <div>
            <p className="font-medium text-emerald-200">You have unclaimed winnings.</p>
            <p className="text-sm text-emerald-100/75">
              Claim your rewards from settled markets below.
            </p>
          </div>
        </div>
      )}

      <section className="table-shell">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-3xl">Your positions</h2>
          <p className="mt-2 text-sm text-slate-400">
            Each entry summarizes your exposure, current market state, and payout readiness.
          </p>
        </div>

        {positions.length === 0 ? (
          <div className="p-10 text-center text-slate-300">
            {CONTRACT_CAPABILITIES.placeBets
              ? "No positions yet. Start betting on prediction markets."
              : "No positions tracked yet. The current V3 deployment does not accept bets, so this view stays informational until trading is redeployed."}
          </div>
        ) : visiblePositions.length === 0 ? (
          <div className="p-10 text-center text-slate-300">
            No positions match the current portfolio filter.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {visiblePositions.map((pm) => {
              const status = getPositionStatus(pm);
              const statusClasses =
                status === "won"
                  ? "status-positive"
                  : status === "lost"
                    ? "status-negative"
                    : status === "claimed"
                      ? "badge-binary"
                      : "status-warning";

              return (
                <div key={pm.market.id} className="px-6 py-5 transition hover:bg-white/6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-2xl">{pm.market.title}</h3>
                      <p className="text-sm text-slate-400">
                        {pm.market.settled
                          ? "This market has settled and your final result is reflected below."
                          : `Settlement target BTC block #${pm.market.settlementHeight}`}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="pill border border-white/10 bg-white/8 text-slate-200">
                          {getPositionOutcome(pm.position)} STX
                        </span>
                        <span className="pill border border-white/10 bg-white/6 text-slate-300">
                          Invested: {formatSTX(pm.position.totalInvested)} STX
                        </span>
                        {pm.market.settled && pm.market.winningOutcome !== null && (
                          <span className="pill border border-sky-300/20 bg-sky-300/10 text-sky-100">
                            Winner: {getOutcomeLabel(pm.market.winningOutcome, pm.market.type)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <div className={`pill ${statusClasses}`}>
                        {status === "won" && <TrendingUp className="h-4 w-4" />}
                        {status === "lost" && <TrendingDown className="h-4 w-4" />}
                        {status === "active" && <Clock className="h-4 w-4" />}
                        {status === "claimed" && <Gift className="h-4 w-4" />}
                        <span className="capitalize">{status}</span>
                      </div>

                      {CONTRACT_CAPABILITIES.claimWinnings && pm.canClaim && (
                        <button
                          onClick={() => handleClaimWinnings(pm.market.id)}
                          disabled={claiming === pm.market.id}
                          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {claiming === pm.market.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Gift className="h-4 w-4" />
                              Claim winnings
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

// [feat/multi-chain-support] commit 5/10: refine pages layer – 1776638306008831496
