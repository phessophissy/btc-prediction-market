"use client";

import { useEffect, useState } from "react";
import { useStacksAuth } from "@/contexts/StacksAuthContext";
import { AlertCircle, TrendingUp, TrendingDown, Clock, Gift, Loader2 } from "lucide-react";
import {
  getUserPositions,
  getUserStats,
  canClaimWinnings,
  formatSTX,
  getOutcomeLabel,
  UserPosition,
  Market,
  UserStats,
} from "@/lib/contractService";
import { CONTRACT_ADDRESS, CONTRACT_NAME, OUTCOME_A, OUTCOME_B, OUTCOME_C, OUTCOME_D } from "@/lib/constants";
import { openContractCall } from "@stacks/connect";
import { uintCV, PostConditionMode } from "@stacks/transactions";

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

  useEffect(() => {
    async function loadPortfolio() {
      if (!stxAddress) return;

      try {
        setLoading(true);

        // Fetch positions and stats in parallel
        const [userPositions, userStats] = await Promise.all([
          getUserPositions(stxAddress),
          getUserStats(stxAddress),
        ]);

        // Check claim eligibility for each position
        const positionsWithClaim = await Promise.all(
          userPositions.map(async ({ position, market }) => {
            const canClaim = await canClaimWinnings(market.id, stxAddress);
            const isWinner = market.settled && market.winningOutcome !== null && (
              (market.winningOutcome === OUTCOME_A && position.outcomeAAmount > 0) ||
              (market.winningOutcome === OUTCOME_B && position.outcomeBAmount > 0) ||
              (market.winningOutcome === OUTCOME_C && position.outcomeCAmount > 0) ||
              (market.winningOutcome === OUTCOME_D && position.outcomeDAmount > 0)
            );
            return { position, market, canClaim, isWinner };
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
          // Refresh positions after claim
          setTimeout(() => window.location.reload(), 2000);
        },
        onCancel: () => {
          setClaiming(null);
        },
      });
    } catch (error) {
      console.error("Failed to claim winnings:", error);
      setClaiming(null);
    }
  };

  const getPositionOutcome = (position: UserPosition): string => {
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
          <p className="text-gray-400">
            Please connect your Stacks wallet to view your portfolio.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Portfolio</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
        <div className="bg-gray-800 rounded-xl p-8 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activePositions = positions.filter((p) => !p.market.settled).length;
  const wonPositions = positions.filter((p) => getPositionStatus(p) === "won").length;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Portfolio</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Bets Placed</p>
          <p className="text-2xl font-bold">{stats?.totalBetsPlaced || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Winnings</p>
          <p className="text-2xl font-bold text-green-500">
            {formatSTX(stats?.totalWinnings || 0)} STX
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active Positions</p>
          <p className="text-2xl font-bold">{activePositions}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Markets Created</p>
          <p className="text-2xl font-bold text-orange-500">
            {stats?.marketsCreated || 0}
          </p>
        </div>
      </div>

      {/* Claimable Winnings Alert */}
      {positions.some((p) => p.canClaim) && (
        <div className="bg-green-900/30 border border-green-500 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Gift className="w-6 h-6 text-green-400" />
          <div>
            <p className="font-medium text-green-400">You have unclaimed winnings!</p>
            <p className="text-sm text-green-300/70">
              Claim your winnings from settled markets below.
            </p>
          </div>
        </div>
      )}

      {/* Positions List */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Your Positions</h2>
        </div>

        {positions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>No positions yet. Start betting on prediction markets!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {positions.map((pm) => {
              const status = getPositionStatus(pm);
              return (
                <div
                  key={pm.market.id}
                  className="p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{pm.market.title}</h3>
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <span className="px-2 py-1 rounded bg-gray-700 text-gray-300">
                          {getPositionOutcome(pm.position)} STX
                        </span>
                        <span className="text-gray-400">
                          Total: {formatSTX(pm.position.totalInvested)} STX
                        </span>
                        {pm.market.settled && pm.market.winningOutcome && (
                          <span className="text-blue-400">
                            Winner: {getOutcomeLabel(pm.market.winningOutcome, pm.market.type)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div
                        className={`flex items-center gap-1 ${
                          status === "won"
                            ? "text-green-500"
                            : status === "lost"
                            ? "text-red-500"
                            : status === "claimed"
                            ? "text-blue-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {status === "won" && <TrendingUp className="w-4 h-4" />}
                        {status === "lost" && <TrendingDown className="w-4 h-4" />}
                        {status === "active" && <Clock className="w-4 h-4" />}
                        {status === "claimed" && <Gift className="w-4 h-4" />}
                        <span className="capitalize font-medium">{status}</span>
                      </div>

                      {pm.canClaim && (
                        <button
                          onClick={() => handleClaimWinnings(pm.market.id)}
                          disabled={claiming === pm.market.id}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {claiming === pm.market.id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Gift className="w-3 h-3" />
                              Claim Winnings
                            </>
                          )}
                        </button>
                      )}

                      {!pm.market.settled && (
                        <p className="text-xs text-gray-400">
                          Settles at block #{pm.market.settlementHeight.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
