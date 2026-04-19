"use client";

import { useState } from "react";
import { useStacksAuth } from "@/contexts/StacksAuthContext";
import { 
  CONTRACT_ADDRESS, 
  CONTRACT_NAME, 
  MARKET_CREATION_FEE,
  NETWORK,
  NETWORK_NAME,
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
import { formatMicroStx } from "@/lib/format";

export default function CreateMarketPage() {
  const { isConnected, stxAddress } = useStacksAuth();
  const [marketType, setMarketType] = useState<"binary" | "multi">("binary");
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [settlementBlock, setSettlementBlock] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const promptTemplates = [
    "Will BTC close above $100k before December 31?",
    "Will the next monthly candle close green?",
    "Will BTC mine a new all-time high this quarter?",
  ];

  const trimmedQuestion = question.trim();
  const trimmedDescription = description.trim();
  const parsedSettlementBlock = Number.parseInt(settlementBlock, 10);
  const validationError =
    !trimmedQuestion
      ? "A market question is required."
      : !settlementBlock
        ? "A settlement block is required."
        : Number.isNaN(parsedSettlementBlock) || parsedSettlementBlock <= 0
          ? "Settlement block must be a positive integer."
          : null;

  const handleCreateMarket = async () => {
    if (!isConnected || !stxAddress) {
      setSubmissionError("Please connect your wallet first.");
      return;
    }

    if (validationError) {
      setSubmissionError(validationError);
      return;
    }

    setSubmissionError(null);
    setSubmissionSuccess(null);
    setIsSubmitting(true);

    try {
      const functionName = marketType === "binary" 
        ? "create-binary-market" 
        : "create-multi-market";

      const functionArgs = [
        stringAsciiCV(trimmedQuestion.slice(0, 100)),
        stringAsciiCV(trimmedDescription.slice(0, 500) || "No description"),
        uintCV(parsedSettlementBlock),
      ];

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
          setSubmissionSuccess(`Market creation submitted: ${data.txId}`);
          setQuestion("");
          setDescription("");
          setSettlementBlock("");
        },
        onCancel: () => {
          console.log("Transaction cancelled");
          setSubmissionError("Market creation was cancelled.");
        },
      });
    } catch (error) {
      console.error("Error creating market:", error);
      setSubmissionError("Failed to create market. Please try again.");
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
      >
        <div className="flex flex-wrap gap-3">
          <span className="glass-strip text-sm text-slate-200">Prompt templates</span>
          <span className="glass-strip text-sm text-slate-200">Live card preview</span>
          <span className="glass-strip text-sm text-slate-200">Wallet-ready flow</span>
        </div>
      </PageHero>

      <div className="card">
        <p className="mb-3 text-sm text-slate-300">Quick-start prompts</p>
        <div className="flex flex-wrap gap-2">
          {promptTemplates.map((template) => (
            <button
              key={template}
              type="button"
              className="btn-pill"
              onClick={() => setQuestion(template)}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-amber-300" />
            <span className="text-amber-100">
              Market creation fee: <strong>{formatMicroStx(MARKET_CREATION_FEE)} STX</strong>
            </span>
          </div>
        </div>
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Network</p>
          <p className="mt-2 text-2xl font-semibold text-white">{NETWORK_NAME}</p>
        </div>
        <div className="panel-soft">
          <p className="text-sm text-slate-300">Settlement mode</p>
          <p className="mt-2 text-2xl font-semibold text-white">BTC burn block</p>
        </div>
      </div>

      <div className="glass-strip flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
        <span>Clear questions settle better: keep the prompt specific, time-bound, and easy to verify on-chain.</span>
        <span className="text-slate-400">The preview on the right updates instantly.</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
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
              disabled={isSubmitting || !!validationError}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Creating Market..."
                : `Create Market (${formatMicroStx(MARKET_CREATION_FEE)} STX)`}
            </button>

            {validationError && !submissionError ? (
              <p className="text-sm text-amber-200">{validationError}</p>
            ) : null}

            {submissionError ? (
              <div className="rounded-[1.25rem] border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-100">
                {submissionError}
              </div>
            ) : null}

            {submissionSuccess ? (
              <div className="rounded-[1.25rem] border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
                {submissionSuccess}
              </div>
            ) : null}
          </div>
        </div>

        <div className="panel-highlight space-y-4">
          <span className="eyebrow">Live preview</span>
          <div className="flex flex-wrap gap-2">
            <span className="pill border border-white/10 bg-white/6 text-slate-200">
              {question.length}/100 question chars
            </span>
            <span className="pill border border-white/10 bg-white/6 text-slate-200">
              {description.length}/500 description chars
            </span>
          </div>
          <div className="panel-soft">
            <p className="text-sm text-slate-300">Question</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {trimmedQuestion || "Your market question will appear here"}
            </p>
          </div>
          <div className="panel-soft">
            <p className="text-sm text-slate-300">Format</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {marketType === "binary" ? "Binary outcomes" : "Four outcome spread"}
            </p>
          </div>
          <div className="panel-soft">
            <p className="text-sm text-slate-300">Settlement target</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {settlementBlock ? `BTC block #${settlementBlock}` : "Awaiting input"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Choose a future burn block you can explain clearly to participants.
            </p>
          </div>
          <div className="panel-soft">
            <p className="text-sm text-slate-300">Description</p>
            <p className="mt-2 text-sm text-slate-200">
              {trimmedDescription || "Additional market context helps participants understand how you expect the question to resolve."}
            </p>
          </div>
          <div className="glass-strip text-sm text-slate-200">
            {validationError
              ? validationError
              : "This preview updates as you write so the final market card feels intentional before submission."}
          </div>
        </div>
      </div>
    </div>
  );
}

// [chore/github-actions-matrix] commit 5/10: refine pages layer – 1776638601161414047
