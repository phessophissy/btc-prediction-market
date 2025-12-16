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
import { AlertCircle, Bitcoin, Calendar, DollarSign } from "lucide-react";

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
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
          <p className="text-gray-400">
            Please connect your Stacks wallet to create a prediction market.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Prediction Market</h1>

      {/* Fee Notice */}
      <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-200">
            Market creation fee: <strong>5 STX</strong>
          </span>
        </div>
      </div>

      {/* Market Type Selection */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Market Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMarketType("binary")}
            className={`p-4 rounded-lg border-2 transition-all ${
              marketType === "binary"
                ? "border-orange-500 bg-orange-500/20"
                : "border-gray-600 hover:border-gray-500"
            }`}
          >
            <h3 className="font-bold">Binary</h3>
            <p className="text-sm text-gray-400">Yes/No outcomes</p>
          </button>
          <button
            onClick={() => setMarketType("multi")}
            className={`p-4 rounded-lg border-2 transition-all ${
              marketType === "multi"
                ? "border-orange-500 bg-orange-500/20"
                : "border-gray-600 hover:border-gray-500"
            }`}
          >
            <h3 className="font-bold">Multi-Outcome</h3>
            <p className="text-sm text-gray-400">Up to 4 outcomes</p>
          </button>
        </div>
      </div>

      {/* Market Details Form */}
      <div className="bg-gray-800 rounded-xl p-6 space-y-6">
        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Question *
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Will BTC reach $100k by end of year?"
            maxLength={100}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">{question.length}/100 characters</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details about the market..."
            maxLength={500}
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
        </div>

        {/* Settlement Block */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <Bitcoin className="w-4 h-4 text-orange-500" />
              Settlement Bitcoin Block *
            </div>
          </label>
          <input
            type="number"
            value={settlementBlock}
            onChange={(e) => setSettlementBlock(e.target.value)}
            placeholder="e.g., 875000"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            The market will settle using the hash of this Bitcoin block
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreateMarket}
          disabled={isSubmitting || !question || !settlementBlock}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors"
        >
          {isSubmitting ? "Creating Market..." : "Create Market (5 STX)"}
        </button>
      </div>
    </div>
  );
}
