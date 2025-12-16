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
import { NETWORK, CONTRACT_ADDRESS, CONTRACT_NAME } from "@/lib/constants";

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

  const getOutcomePool = () => {
    switch (outcome) {
      case "A": return market.outcomeAPoll;
      case "B": return market.outcomeBPool;
      case "C": return market.outcomeCPool || 0;
      case "D": return market.outcomeDPool || 0;
      default: return 0;
    }
  };

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

    setIsSubmitting(true);

    const betAmountMicroSTX = Math.floor(parseFloat(amount) * 1000000);

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
      setIsSubmitting(false);
    }
  };

  const outcomeColors: Record<string, string> = {
    A: "text-stacks border-stacks",
    B: "text-bitcoin border-bitcoin",
    C: "text-green-400 border-green-400",
    D: "text-purple-400 border-purple-400",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold mb-2">Place Your Bet</h2>
        <p className="text-slate-400 text-sm mb-6">{market.title}</p>

        {/* Selected Outcome */}
        <div className={`border rounded-lg p-4 mb-6 ${outcomeColors[outcome]}`}>
          <span className="text-sm opacity-75">You're betting on:</span>
          <p className="text-lg font-semibold">Outcome {outcome}</p>
        </div>

        {/* Bet Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">
              Bet Amount (STX)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="1"
                step="0.1"
                className="input w-full pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                STX
              </span>
            </div>
          </div>

          {/* Potential Win */}
          {parseFloat(amount) > 0 && (
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Potential Win:</span>
                <span className="text-green-400 font-semibold">
                  {calculatePotentialWin()} STX
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Platform Fee:</span>
                <span className="text-slate-300">3%</span>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 text-sm text-slate-400 mb-6">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              This market will settle based on the Bitcoin block hash at the
              specified block height. Outcomes are determined trustlessly.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount || parseFloat(amount) < 1 || isSubmitting}
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
