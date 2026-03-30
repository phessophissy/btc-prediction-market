"use client";

import { useEffect, useState } from "react";
import { useStacksAuth } from "@/contexts/StacksAuthContext";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Gavel,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";
import { BetModal } from "./BetModal";
import { isMarketSettleable } from "@/lib/contractService";
import { CONTRACT_ADDRESS, CONTRACT_CAPABILITIES, CONTRACT_NAME } from "@/lib/constants";
import { formatBlocksToEta, formatMicroStx } from "@/lib/format";
import {
  getMarketLeadOutcome,
  getMarketLiquidityLabel,
  getMarketMomentumLabel,
  getMarketUrgencyLabel,
} from "@/lib/marketPresentation";
import { openContractCall } from "@stacks/connect";
import { PostConditionMode, uintCV } from "@stacks/transactions";

interface Market {
  id: number;
  title: string;
  description: string;
  settlementHeight: number;
  currentBurnHeight: number;
  totalPool: number;
  outcomeAPoll: number;
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

  const blocksRemaining = market.settlementHeight - market.currentBurnHeight;
  const liquidityLabel = getMarketLiquidityLabel(market.totalPool);
  const urgencyLabel = getMarketUrgencyLabel(blocksRemaining);
  const momentumLabel = getMarketMomentumLabel({
    totalPool: market.totalPool,
    outcomeAPool: market.outcomeAPoll,
    outcomeBPool: market.outcomeBPool,
    outcomeCPool: market.outcomeCPool || 0,
    outcomeDPool: market.outcomeDPool || 0,
    type: market.type,
  });
  const leadOutcome = getMarketLeadOutcome({
    outcomeAPool: market.outcomeAPoll,
    outcomeBPool: market.outcomeBPool,
    outcomeCPool: market.outcomeCPool || 0,
    outcomeDPool: market.outcomeDPool || 0,
    type: market.type,
  });

  useEffect(() => {
    async function checkSettleable() {
      if (market.settled || !CONTRACT_CAPABILITIES.settleMarkets) {
        setCanSettle(false);
        return;
      }

      try {
        setCanSettle(await isMarketSettleable(market.id));
      } catch (error) {
        console.error("Failed to check settleable:", error);
        setCanSettle(false);
      }
    }

    checkSettleable();
  }, [market.id, market.settled]);

  const calculateOdds = (pool: number, total: number) => {
    if (pool === 0) return "No liquidity";
    return `${(total / pool).toFixed(2)}x`;
  };

  const calculatePercentage = (pool: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((pool / total) * 100);
  };

  const getOutcomeCaption = (percentage: number) => {
    if (percentage >= 55) return "Strong share";
    if (percentage >= 30) return "Competitive";
    if (percentage > 0) return "Building";
    return "No flow yet";
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
          setTimeout(() => window.location.reload(), 2000);
        },
        onCancel: () => setSettling(false),
      });
    } catch (error) {
      console.error("Failed to settle market:", error);
      setSettling(false);
    }
  };

  const outcomes = [
    {
      id: "A",
      label: market.type === "binary" ? "Yes (Even)" : "Quarter A (0-63)",
      pool: market.outcomeAPoll,
      tone: "from-sky-400 via-cyan-300 to-teal-300",
      valueClass: "text-sky-300",
    },
    {
      id: "B",
      label: market.type === "binary" ? "No (Odd)" : "Quarter B (64-127)",
      pool: market.outcomeBPool,
      tone: "from-amber-300 via-orange-300 to-rose-300",
      valueClass: "text-amber-300",
    },
    {
      id: "C",
      label: "Quarter C (128-191)",
      pool: market.outcomeCPool || 0,
      tone: "from-emerald-300 via-lime-300 to-yellow-200",
      valueClass: "text-emerald-300",
    },
    {
      id: "D",
      label: "Quarter D (192-255)",
      pool: market.outcomeDPool || 0,
      tone: "from-fuchsia-400 via-rose-400 to-orange-300",
      valueClass: "text-pink-300",
    },
  ];

  const visibleOutcomes =
    market.type === "binary" || expanded ? outcomes.slice(0, market.type === "binary" ? 2 : 4) : outcomes.slice(0, 2);

  return (
    <>
      <div className={`card transition-transform duration-300 hover:-translate-y-1 ${market.settled ? "opacity-85" : ""}`}>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`pill ${market.type === "binary" ? "badge-binary" : "badge-multi"}`}>
                {market.type === "binary" ? "Binary" : "Multi-outcome"}
              </span>
              <span className="pill border border-white/10 bg-white/6 text-slate-300">
                {market.type === "binary" ? "2 outcomes" : "4 outcomes"}
              </span>
              <span className="pill border border-white/10 bg-white/6 text-slate-300">Market #{market.id}</span>
              <span className="pill border border-white/10 bg-white/6 text-slate-200">{liquidityLabel}</span>
              {market.settled && (
                <span className="pill status-positive">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Settled
                </span>
              )}
              {!market.settled && canSettle && (
                <span className="pill status-warning">Ready to settle</span>
              )}
              {!market.settled && !canSettle ? (
                <span className="pill border border-white/10 bg-white/6 text-slate-300">
                  {urgencyLabel}
                </span>
              ) : null}
            </div>
            <div className="glass-strip inline-flex text-sm text-slate-200">
              <TrendingUp className="h-4 w-4 text-amber-300" />
              {momentumLabel}
            </div>
            <div>
              <h3 className="mb-2 text-3xl">{market.title}</h3>
              <p className="max-w-3xl text-sm text-slate-300">{market.description}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[22rem] lg:grid-cols-1">
            <div className="panel-soft">
              <span className="subtle-copy text-xs uppercase tracking-[0.18em]">Total pool</span>
              <p className="mt-2 text-2xl font-semibold text-white">{formatMicroStx(market.totalPool)} STX</p>
            </div>
            <div className="panel-soft">
              <span className="subtle-copy text-xs uppercase tracking-[0.18em]">Settlement pace</span>
              <p className="mt-2 text-lg text-white">
                {market.settled
                  ? "Completed"
                  : blocksRemaining > 0
                    ? formatBlocksToEta(blocksRemaining)
                    : "Awaiting settlement"}
              </p>
            </div>
            <div className="panel-soft">
              <span className="subtle-copy text-xs uppercase tracking-[0.18em]">Market lead</span>
              <p className="mt-2 text-lg text-white">
                {leadOutcome ? `Outcome ${leadOutcome.id}` : "Pending"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-5 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-300" />
            {liquidityLabel}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-300" />
            {market.settled ? "Market settled" : `${Math.max(blocksRemaining, 0)} blocks remaining`}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-300" />
            {leadOutcome ? `Outcome ${leadOutcome.id} currently ahead` : "Open price discovery"}
          </div>
        </div>

        <div className="space-y-4">
          {visibleOutcomes.map((outcome) => (
            <div key={outcome.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-200">{outcome.label}</span>
                <div className="flex items-center gap-3">
                  <span className="subtle-copy">{formatMicroStx(outcome.pool)} STX</span>
                  <span className="subtle-copy">{getOutcomeCaption(calculatePercentage(outcome.pool, market.totalPool))}</span>
                  <span className={`font-semibold ${outcome.valueClass}`}>
                    {calculateOdds(outcome.pool, market.totalPool)}
                  </span>
                </div>
              </div>
              <div className="market-meter">
                <div
                  className={`market-meter-fill bg-gradient-to-r ${outcome.tone}`}
                  style={{ width: `${calculatePercentage(outcome.pool, market.totalPool)}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-950">
                  {calculatePercentage(outcome.pool, market.totalPool)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {market.type === "multi" && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-ghost mt-5 px-0 text-sm text-slate-300"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show all outcomes
              </>
            )}
          </button>
        )}

        {!market.settled ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {!isConnected ? (
              <div className="w-full rounded-[1.35rem] border border-white/10 bg-white/6 p-4 text-sm text-slate-300">
                Connect a wallet to interact with this market.
              </div>
            ) : null}
            {CONTRACT_CAPABILITIES.settleMarkets && canSettle ? (
              <button
                onClick={handleSettleMarket}
                disabled={settling || !isConnected}
                className="btn-secondary w-full border-amber-300/25 bg-amber-300/10 text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {settling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Settling market...
                  </>
                ) : (
                  <>
                    <Gavel className="h-4 w-4" />
                    Settle market and claim reward
                  </>
                )}
              </button>
            ) : CONTRACT_CAPABILITIES.placeBets ? (
              <>
                <button
                  onClick={() => handleBet("A")}
                  disabled={!isConnected || blocksRemaining <= 0}
                  className="btn-secondary flex-1 border-sky-300/20 bg-sky-300/10 text-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Bet {market.type === "binary" ? "Yes" : "A"}
                </button>
                <button
                  onClick={() => handleBet("B")}
                  disabled={!isConnected || blocksRemaining <= 0}
                  className="btn-secondary flex-1 border-amber-300/20 bg-amber-300/10 text-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Bet {market.type === "binary" ? "No" : "B"}
                </button>
                {market.type === "multi" && (
                  <>
                    <button
                      onClick={() => handleBet("C")}
                      disabled={!isConnected || blocksRemaining <= 0}
                      className="btn-secondary flex-1 border-emerald-300/20 bg-emerald-300/10 text-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Bet C
                    </button>
                    <button
                      onClick={() => handleBet("D")}
                      disabled={!isConnected || blocksRemaining <= 0}
                      className="btn-secondary flex-1 border-pink-300/20 bg-pink-300/10 text-pink-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Bet D
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full rounded-[1.35rem] border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                The current `btc-prediction-market-v3` deployment supports market creation and
                read-only tracking. Betting and settlement actions stay disabled until the trading
                entrypoints are redeployed.
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.35rem] border border-emerald-300/20 bg-emerald-300/10 p-4 text-center">
            <p className="flex items-center justify-center gap-2 text-sm text-emerald-200">
              <CheckCircle className="h-4 w-4" />
              This market is settled on-chain. Claim actions remain disabled for the current V3 deployment.
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm text-slate-300">
          <span>Settlement target BTC block #{market.settlementHeight}</span>
          <span>{market.settled ? "Finalized on-chain" : `${urgencyLabel} on the current board`}</span>
        </div>
      </div>

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
