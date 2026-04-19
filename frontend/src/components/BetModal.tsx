"use client";

import { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { useStacksAuth } from "@/contexts/StacksAuthContext";
import { openContractCall } from "@stacks/connect";
import {
  uintCV, 
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from "@stacks/transactions";
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  MIN_BET_AMOUNT,
  NETWORK,
} from "@/lib/constants";
import { formatMicroStx } from "@/lib/format";

interface Market {
  id: number;
  title: string;
  totalPool: number;
  outcomeAPoll: number;
  outcomeBPool: number;
  outcomeCPool?: number;
  outcomeDPool?: number;
}

interface BetModalProps {
  market: Market;
  outcome: string;
  onClose: () => void;
}

export function BetModal({ market, outcome, onClose }: BetModalProps) {
  const { stxAddress } = useStacksAuth();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const parsedAmount = Number.parseFloat(amount || "0");
  const minimumBet = MIN_BET_AMOUNT / 1_000_000;

  const getOutcomePool = () => {
    switch (outcome) {
      case "A": return market.outcomeAPoll;
      case "B": return market.outcomeBPool;
      case "C": return market.outcomeCPool || 0;
      case "D": return market.outcomeDPool || 0;
      default: return 0;
    }
  };

  const outcomeLabel =
    outcome === "A"
      ? "Outcome A"
      : outcome === "B"
        ? "Outcome B"
        : outcome === "C"
          ? "Outcome C"
          : "Outcome D";

  const calculatePotentialWin = () => {
    const betAmount = parseFloat(amount) || 0;
    const betMicroSTX = betAmount * 1000000;
    const currentPool = getOutcomePool();
    const newPool = currentPool + betMicroSTX;
    const newTotal = market.totalPool + betMicroSTX;
    
    if (newPool === 0) return 0;
    
    const grossPayout = (betMicroSTX * newTotal) / newPool;
    const fee = grossPayout * 0.03; // 3% fee
    const netPayout = grossPayout - fee;
    
    return (netPayout / 1000000).toFixed(2);
  };

  const getFunctionName = () => {
    switch (outcome) {
      case "A": return "bet-outcome-a";
      case "B": return "bet-outcome-b";
      case "C": return "bet-outcome-c";
      case "D": return "bet-outcome-d";
      default: return "bet-outcome-a";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stxAddress || !amount) return;
    if (parsedAmount < minimumBet) {
      setError(`Minimum bet is ${minimumBet} STX.`);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const betAmountMicroSTX = Math.floor(parsedAmount * 1_000_000);

    try {
      await openContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: getFunctionName(),
        functionArgs: [
          uintCV(market.id),
          uintCV(betAmountMicroSTX),
        ],
        postConditions: [
          makeStandardSTXPostCondition(
            stxAddress,
            FungibleConditionCode.Equal,
            betAmountMicroSTX
          ),
        ],
        onFinish: (data) => {
          console.log("Transaction submitted:", data);
          onClose();
        },
        onCancel: () => {
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Error placing bet:", error);
      setError("Failed to place bet. Please try again.");
      setIsSubmitting(false);
    }
  };

  const outcomeColors: Record<string, string> = {
    A: "border-sky-300/30 bg-sky-300/10 text-sky-100",
    B: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    C: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
    D: "border-pink-300/30 bg-pink-300/10 text-pink-100",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
      <div className="card relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/6 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Close bet modal"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="eyebrow mb-4">Place a position</span>
        <h2 className="mb-2 text-3xl">Place your bet</h2>
        <p className="mb-6 text-sm text-slate-300">{market.title}</p>

        <div className={`border rounded-lg p-4 mb-6 ${outcomeColors[outcome]}`}>
          <span className="text-sm opacity-75">You're betting on:</span>
          <p className="text-lg font-semibold">{outcomeLabel}</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="panel-soft">
            <p className="text-sm text-slate-300">Current outcome pool</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {formatMicroStx(getOutcomePool())} STX
            </p>
          </div>
          <div className="panel-soft">
            <p className="text-sm text-slate-300">Total market pool</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {formatMicroStx(market.totalPool)} STX
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm text-slate-300">
              Bet Amount (STX)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                placeholder="0.00"
                min={minimumBet}
                step="0.01"
                className="input w-full pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                STX
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Minimum bet: {minimumBet} STX. Total pool: {formatMicroStx(market.totalPool)} STX.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {[0.05, 0.1, 0.25, 1].map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => {
                  setAmount(quickAmount.toString());
                  setError(null);
                }}
                className="btn-secondary px-4 py-2 text-xs"
              >
                +{quickAmount} STX
              </button>
            ))}
          </div>

          {parsedAmount > 0 && (
            <div className="mb-6 rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">Potential Win:</span>
                <span className="font-semibold text-emerald-300">
                  {calculatePotentialWin()} STX
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Platform Fee:</span>
                <span className="text-slate-200">3%</span>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Estimate is derived from the current pool snapshot and will shift if new positions arrive first.
              </p>
            </div>
          )}

          <div className="mb-6 flex items-start gap-2 text-sm text-slate-300">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              This market will settle based on the Bitcoin block hash at the
              specified block height. Outcomes are determined trustlessly.
            </p>
          </div>

          {error ? (
            <div className="mb-6 rounded-[1.25rem] border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!amount || parsedAmount < minimumBet || isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming...
              </>
            ) : (
              <>Place Bet</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// [feat/social-trading] commit 2/10: improve ui layer – 1776638339126818078
