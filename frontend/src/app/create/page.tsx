"use client";

import { useState } from "react";
import { useStacksAuth } from "@/contexts/StacksAuthContext";
import { 
  CONTRACT_ADDRESS, 
  CONTRACT_NAME, 
  MARKET_CREATION_FEE,
  NETWORK 
} from "@/lib/constants";
import { openContractCall } from "@stacks/connect";
import { 
  uintCV, 
  stringAsciiCV,
  PostConditionMode,
  makeStandardSTXPostCondition,
  FungibleConditionCode
} from "@stacks/transactions";
import { Bitcoin, DollarSign } from "lucide-react";
import { ConnectionRequired } from "@/components/ConnectionRequired";
import { PageHero } from "@/components/PageHero";

export default function CreateMarketPage() {
  const { isConnected, stxAddress } = useStacksAuth();
  const [marketType, setMarketType] = useState<"binary" | "multi">("binary");
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [settlementBlock, setSettlementBlock] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateMarket = async () => {
    if (!isConnected || !stxAddress) {
      alert("Please connect your wallet first");
      return;
    }

    if (!question || !settlementBlock) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const functionName = marketType === "binary" 
        ? "create-binary-market" 
        : "create-multi-market";

      const functionArgs = [
        stringAsciiCV(question.slice(0, 100)),
        stringAsciiCV(description.slice(0, 500) || "No description"),
        uintCV(parseInt(settlementBlock)),
      ];

      // Add post condition for the 5 STX fee
      const postConditions = [
        makeStandardSTXPostCondition(
          stxAddress,
          FungibleConditionCode.Equal,
          MARKET_CREATION_FEE
        ),
      ];

      await openContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs,
        postConditionMode: PostConditionMode.Deny,
        postConditions,
        onFinish: (data) => {
          console.log("Transaction submitted:", data);
          alert(`Market creation submitted! TX: ${data.txId}`);
          setQuestion("");
          setDescription("");
          setSettlementBlock("");
        },
        onCancel: () => {
          console.log("Transaction cancelled");
        },
      });
    } catch (error) {
      console.error("Error creating market:", error);
      alert("Failed to create market. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <ConnectionRequired
          title="Connect Wallet"
          description="Please connect your Stacks wallet to create a prediction market."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHero
        eyebrow="Launch a new market"
        title="Create prediction market"
        description="Define the question, pick a settlement block, and publish a colorful market card directly from your connected wallet."
        compact
      />

      <div className="card">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-amber-300" />
          <span className="text-amber-100">
            Market creation fee: <strong>5 STX</strong>
          </span>
        </div>
      </div>

      <div className="card">
        <label className="mb-3 block text-sm font-medium text-slate-200">
          Market Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMarketType("binary")}
            className={`rounded-[1.5rem] border p-5 text-left transition-all ${
              marketType === "binary"
                ? "border-amber-300/40 bg-amber-300/12"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <h3 className="mb-1 text-2xl">Binary</h3>
            <p className="text-sm text-slate-300">Yes/No outcomes</p>
          </button>
          <button
            onClick={() => setMarketType("multi")}
            className={`rounded-[1.5rem] border p-5 text-left transition-all ${
              marketType === "multi"
                ? "border-amber-300/40 bg-amber-300/12"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <h3 className="mb-1 text-2xl">Multi-Outcome</h3>
            <p className="text-sm text-slate-300">Up to 4 outcomes</p>
          </button>
        </div>
      </div>

      <div className="card space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Question *
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Will BTC reach $100k by end of year?"
            maxLength={100}
            className="input"
          />
          <p className="mt-2 text-xs text-slate-400">{question.length}/100 characters</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details about the market..."
            maxLength={500}
            rows={3}
            className="input min-h-[120px]"
          />
          <p className="mt-2 text-xs text-slate-400">{description.length}/500 characters</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4 text-amber-300" />
              Settlement Bitcoin Block *
            </div>
          </label>
          <input
            type="number"
            value={settlementBlock}
            onChange={(e) => setSettlementBlock(e.target.value)}
            placeholder="e.g., 875000"
            className="input"
          />
          <p className="mt-2 text-xs text-slate-400">
            The market will settle using the hash of this Bitcoin block
          </p>
        </div>

        <button
          onClick={handleCreateMarket}
          disabled={isSubmitting || !question || !settlementBlock}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating Market..." : "Create Market (5 STX)"}
        </button>
      </div>
    </div>
  );
}
