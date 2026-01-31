"use client";

import { useState, useEffect } from "react";
import { useStacksAuth } from "@/contexts/StacksAuthContext";
import { Clock, Users, TrendingUp, ChevronDown, ChevronUp, Gavel, Loader2, CheckCircle } from "lucide-react";
import { BetModal } from "./BetModal";
import { isMarketSettleable } from "@/lib/contractService";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "@/lib/constants";
import { openContractCall } from "@stacks/connect";
import { uintCV, PostConditionMode } from "@stacks/transactions";

interface Market {
  id: number;
  title: string;
  description: string;
  settlementHeight: number;
  currentBurnHeight: number;
  totalPool: number;
  outcomeAPool: number; 
  outcomeBPool: number;
  outcomeCPool?: number;
  outcomeDPool?: number;
  settled: boolean;
  type: "binary" | "multi";
}

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const { isConnected, network } = useStacksAuth();
  const [expanded, setExpanded] = useState(false);
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [canSettle, setCanSettle] = useState(false);
  const [settling, setSettling] = useState(false);
  const [checkingSettle, setCheckingSettle] = useState(true);

  const blocksRemaining = market.settlementHeight - market.currentBurnHeight;
  const timeRemaining = blocksRemaining * 10; // ~10 min per BTC block

  // Check if market can be settled
  useEffect(() => {
    async function checkSettleable() {
      if (market.settled) {
        setCanSettle(false);
        setCheckingSettle(false);
        return;
      }

      try {
        const settleable = await isMarketSettleable(market.id);
        setCanSettle(settleable);
      } catch (error) {
        console.error("Failed to check settleable:", error);
        setCanSettle(false);
      } finally {
        setCheckingSettle(false);
      }
    }

    checkSettleable();
  }, [market.id, market.settled]);

  const formatSTX = (microSTX: number) => {
    return (microSTX / 1000000).toLocaleString();
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
  };

  const calculateOdds = (pool: number, total: number) => {
    if (pool === 0) return "";
    return (total / pool).toFixed(2) + "x";
  };

  const calculatePercentage = (pool: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((pool / total) * 100);
  };

  const handleBet = (outcome: string) => {
    if (!isConnected) return;
    setSelectedOutcome(outcome);
    setBetModalOpen(true);
  };

  const handleSettleMarket = async () => {
    if (!isConnected) return;

    setSettling(true);
    try {
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "settle-market",
        functionArgs: [uintCV(market.id)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log("Settlement transaction submitted:", data);
          // Refresh page after settlement
          setTimeout(() => window.location.reload(), 2000);
        },
        onCancel: () => {
          setSettling(false);
        },
      });
    } catch (error) {
      console.error("Failed to settle market:", error);
      setSettling(false);
    }
  };

  return (
    <>
      <div className={`card hover:border-slate-600 transition-colors ${market.settled ? "opacity-75" : ""}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  market.type === "binary"
                    ? "bg-stacks/20 text-stacks"
                    : "bg-bitcoin/20 text-bitcoin"
                }`}
              >
                {market.type === "binary" ? "Binary" : "Multi-outcome"}
              </span>
              <span className="text-xs text-slate-500">#{market.id}</span>
              {market.settled && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Settled
                </span>
              )}
              {canSettle && !market.settled && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 animate-pulse">
                  Ready to Settle
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">{market.title}</h3>
            <p className="text-slate-400 text-sm">{market.description}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 mb-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{formatSTX(market.totalPool)} STX</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {market.settled ? (
              <span className="text-green-400">Completed</span>
            ) : blocksRemaining > 0 ? (
              <span>{formatTime(timeRemaining)}</span>
            ) : (
              <span className="text-yellow-400">Awaiting settlement</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Block #{market.settlementHeight}</span>
          </div>
        </div>

        {/* Outcome Bars */}
        <div className="space-y-3 mb-4">
          {/* Outcome A */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>
                {market.type === "binary" ? "Yes (Even)" : "Quarter A (0-63)"}
              </span>
              <span className="text-stacks">
                {calculateOdds(market.outcomeAPoll, market.totalPool)}
              </span>
            </div>
            <div className="h-8 bg-slate-700 rounded-lg overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-stacks to-stacks/70 transition-all"
                style={{
                  width: `${calculatePercentage(market.outcomeAPoll, market.totalPool)}%`,
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                {calculatePercentage(market.outcomeAPoll, market.totalPool)}%
              </span>
            </div>
          </div>

          {/* Outcome B */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>
                {market.type === "binary" ? "No (Odd)" : "Quarter B (64-127)"}
              </span>
              <span className="text-bitcoin">
                {calculateOdds(market.outcomeBPool, market.totalPool)}
              </span>
            </div>
            <div className="h-8 bg-slate-700 rounded-lg overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-bitcoin to-bitcoin/70 transition-all"
                style={{
                  width: `${calculatePercentage(market.outcomeBPool, market.totalPool)}%`,
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                {calculatePercentage(market.outcomeBPool, market.totalPool)}%
              </span>
            </div>
          </div>

          {/* Additional outcomes for multi-outcome markets */}
          {market.type === "multi" && expanded && (
            <>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Quarter C (128-191)</span>
                  <span className="text-green-400">
                    {calculateOdds(market.outcomeCPool || 0, market.totalPool)}
                  </span>
                </div>
                <div className="h-8 bg-slate-700 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-500/70 transition-all"
                    style={{
                      width: `${calculatePercentage(market.outcomeCPool || 0, market.totalPool)}%`,
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {calculatePercentage(market.outcomeCPool || 0, market.totalPool)}%
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Quarter D (192-255)</span>
                  <span className="text-purple-400">
                    {calculateOdds(market.outcomeDPool || 0, market.totalPool)}
                  </span>
                </div>
                <div className="h-8 bg-slate-700 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-500/70 transition-all"
                    style={{
                      width: `${calculatePercentage(market.outcomeDPool || 0, market.totalPool)}%`,
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {calculatePercentage(market.outcomeDPool || 0, market.totalPool)}%
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Expand/Collapse for multi-outcome */}
        {market.type === "multi" && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-4"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Show all outcomes
              </>
            )}
          </button>
        )}

        {/* Action Buttons */}
        {!market.settled ? (
          <div className="flex gap-3">
            {canSettle ? (
              /* Settle Market Button */
              <button
                onClick={handleSettleMarket}
                disabled={settling || !isConnected}
                className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {settling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Settling...
                  </>
                ) : (
                  <>
                    <Gavel className="w-4 h-4" />
                    Settle Market (Earn Reward)
                  </>
                )}
              </button>
            ) : (
              /* Betting Buttons */
              <>
                <button
                  onClick={() => handleBet("A")}
                  disabled={!isConnected || blocksRemaining <= 0}
                  className="flex-1 bg-stacks/20 hover:bg-stacks/30 text-stacks border border-stacks/30 py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  Bet {market.type === "binary" ? "Yes" : "A"}
                </button>
                <button
                  onClick={() => handleBet("B")}
                  disabled={!isConnected || blocksRemaining <= 0}
                  className="flex-1 bg-bitcoin/20 hover:bg-bitcoin/30 text-bitcoin border border-bitcoin/30 py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  Bet {market.type === "binary" ? "No" : "B"}
                </button>
                {market.type === "multi" && (
                  <>
                    <button
                      onClick={() => handleBet("C")}
                      disabled={!isConnected || blocksRemaining <= 0}
                      className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Bet C
                    </button>
                    <button
                      onClick={() => handleBet("D")}
                      disabled={!isConnected || blocksRemaining <= 0}
                      className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Bet D
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          /* Settled State */
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
            <p className="text-green-400 text-sm flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              This market has been settled. Check your portfolio for winnings.
            </p>
          </div>
        )}
      </div>

      {/* Bet Modal */}
      {betModalOpen && selectedOutcome && (
        <BetModal
          market={market}
          outcome={selectedOutcome}
          onClose={() => setBetModalOpen(false)}
        />
      )}
    </>
  );
}
