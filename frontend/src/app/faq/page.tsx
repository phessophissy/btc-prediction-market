"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Accordion } from "@/components/Accordion";
import { PageHero } from "@/components/PageHero";

const faqItems = [
  {
    id: "what-is",
    category: "general",
    title: "What is BTC Predict?",
    content:
      "BTC Predict is a decentralized prediction market built on the Stacks blockchain. Users can create binary or multi-outcome markets about future Bitcoin events, place bets using STX, and earn rewards when their predictions are correct.",
  },
  {
    id: "how-bet",
    category: "betting",
    title: "How do I place a bet?",
    content:
      "Connect your Stacks wallet, browse active markets, and click the outcome you want to bet on. Enter the amount of STX you want to wager, review the transaction, and confirm in your wallet.",
  },
  {
    id: "settlement",
    category: "technical",
    title: "How are markets settled?",
    content:
      "Markets are settled after the specified Bitcoin block height is reached. The market creator or any participant with the correct oracle data can trigger settlement. Winnings are distributed proportionally based on your share of the winning pool.",
  },
  {
    id: "fees",
    category: "betting",
    title: "What fees are charged?",
    content:
      "The platform charges a small percentage fee on winnings (not on the initial bet). The exact fee rate is displayed when placing a bet. There are no fees for creating markets.",
  },
  {
    id: "wallets",
    category: "technical",
    title: "Which wallets are supported?",
    content:
      "BTC Predict supports any Stacks-compatible wallet including Leather (formerly Hiro Wallet) and Xverse. Make sure you have STX in your wallet to participate.",
  },
  {
    id: "market-types",
    category: "general",
    title: "What market types are available?",
    content:
      "Binary markets have two outcomes (Yes/No). Multi-outcome markets can have up to 6 possible outcomes, useful for range predictions like 'Will BTC be above 50K, 60K, or 70K?'",
  },
  {
    id: "risks",
    category: "betting",
    title: "What are the risks?",
    content:
      "Prediction markets involve risk of loss. You could lose your entire bet if your prediction is incorrect. Smart contracts are audited but may contain unknown vulnerabilities. Only bet what you can afford to lose.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'betting' | 'technical'>('all');
  
  const categories = [
    { value: 'all', label: 'All' },
    { value: 'general', label: 'General' },
    { value: 'betting', label: 'Betting' },
    { value: 'technical', label: 'Technical' },
  ];

  const filteredItems = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [feedback, setFeedback] = useState<Record<string, 'helpful' | 'not-helpful' | null>>({});

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHero
        eyebrow="Help center"
        title="Frequently Asked Questions"
        description="Everything you need to know about BTC Predict — from wallet setup to market settlement."
        compact
      >
        <div className="flex flex-wrap gap-3">
          <span className="glass-strip text-sm text-slate-200">Searchable</span>
          <span className="glass-strip text-sm text-slate-200">Categorized</span>
          <span className="glass-strip text-sm text-slate-200">{faqItems.length} questions</span>
        </div>
      </PageHero>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.value}
            type="button"
            data-active={activeCategory === cat.value}
            onClick={() => setActiveCategory(cat.value as typeof activeCategory)}
            className="btn-pill"
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-11"
          placeholder="Search questions..."
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/8"
          >
            Clear
          </button>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-slate-300">No questions match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(item => (
            <div key={item.id} className="card">
              <Accordion items={[item]} />
              <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-3">
                <span className="text-xs text-slate-400">Was this helpful?</span>
                <button
                  type="button"
                  onClick={() => setFeedback(prev => ({ ...prev, [item.id]: 'helpful' }))}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    feedback[item.id] === 'helpful'
                      ? 'border-emerald-300/30 bg-emerald-300/15 text-emerald-300'
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  👍 Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFeedback(prev => ({ ...prev, [item.id]: 'not-helpful' }))}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    feedback[item.id] === 'not-helpful'
                      ? 'border-rose-300/30 bg-rose-300/15 text-rose-300'
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  👎 No
                </button>
                {feedback[item.id] && (
                  <span className="text-xs text-slate-500 animate-fade-in">Thanks for your feedback!</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
