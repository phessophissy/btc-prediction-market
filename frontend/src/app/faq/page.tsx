import { Accordion } from "@/components/Accordion";

const faqItems = [
  {
    id: "what-is",
    title: "What is BTC Predict?",
    content:
      "BTC Predict is a decentralized prediction market built on the Stacks blockchain. Users can create binary or multi-outcome markets about future Bitcoin events, place bets using STX, and earn rewards when their predictions are correct.",
  },
  {
    id: "how-bet",
    title: "How do I place a bet?",
    content:
      "Connect your Stacks wallet, browse active markets, and click the outcome you want to bet on. Enter the amount of STX you want to wager, review the transaction, and confirm in your wallet.",
  },
  {
    id: "settlement",
    title: "How are markets settled?",
    content:
      "Markets are settled after the specified Bitcoin block height is reached. The market creator or any participant with the correct oracle data can trigger settlement. Winnings are distributed proportionally based on your share of the winning pool.",
  },
  {
    id: "fees",
    title: "What fees are charged?",
    content:
      "The platform charges a small percentage fee on winnings (not on the initial bet). The exact fee rate is displayed when placing a bet. There are no fees for creating markets.",
  },
  {
    id: "wallets",
    title: "Which wallets are supported?",
    content:
      "BTC Predict supports any Stacks-compatible wallet including Leather (formerly Hiro Wallet) and Xverse. Make sure you have STX in your wallet to participate.",
  },
  {
    id: "market-types",
    title: "What market types are available?",
    content:
      "Binary markets have two outcomes (Yes/No). Multi-outcome markets can have up to 6 possible outcomes, useful for range predictions like 'Will BTC be above 50K, 60K, or 70K?'",
  },
  {
    id: "risks",
    title: "What are the risks?",
    content:
      "Prediction markets involve risk of loss. You could lose your entire bet if your prediction is incorrect. Smart contracts are audited but may contain unknown vulnerabilities. Only bet what you can afford to lose.",
  },
];

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="mb-3 font-serif text-3xl font-bold text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-white/50">
          Everything you need to know about BTC Predict.
        </p>
      </div>
      <Accordion items={faqItems} />
    </main>
  );
}
