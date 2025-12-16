"use client";

import { useStacksAuth } from "@/contexts/StacksAuthContext";
import { AlertCircle, TrendingUp, TrendingDown, Clock } from "lucide-react";

export default function PortfolioPage() {
  const { isConnected, stxAddress } = useStacksAuth();

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

  // Mock data - in production, fetch from contract
  const positions = [
    {
      id: 1,
      question: "Will BTC reach $150k by Q1 2026?",
      outcome: "Yes",
      amount: 50,
      odds: 2.5,
      status: "active",
      potentialWin: 125,
    },
    {
      id: 2,
      question: "ETH flips BTC market cap in 2026?",
      outcome: "No",
      amount: 25,
      odds: 1.8,
      status: "active",
      potentialWin: 45,
    },
    {
      id: 3,
      question: "Stacks TVL > $1B by end of 2025?",
      outcome: "Yes",
      amount: 100,
      odds: 3.2,
      status: "won",
      potentialWin: 320,
    },
  ];

  const stats = {
    totalInvested: 175,
    totalWon: 320,
    activePositions: 2,
    winRate: 67,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Portfolio</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Invested</p>
          <p className="text-2xl font-bold">{stats.totalInvested} STX</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Won</p>
          <p className="text-2xl font-bold text-green-500">{stats.totalWon} STX</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active Positions</p>
          <p className="text-2xl font-bold">{stats.activePositions}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Win Rate</p>
          <p className="text-2xl font-bold text-orange-500">{stats.winRate}%</p>
        </div>
      </div>

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
            {positions.map((position) => (
              <div key={position.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{position.question}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded ${
                        position.outcome === "Yes" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {position.outcome}
                      </span>
                      <span className="text-gray-400">
                        {position.amount} STX @ {position.odds}x
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${
                      position.status === "won" ? "text-green-500" : 
                      position.status === "lost" ? "text-red-500" : "text-yellow-500"
                    }`}>
                      {position.status === "won" && <TrendingUp className="w-4 h-4" />}
                      {position.status === "lost" && <TrendingDown className="w-4 h-4" />}
                      {position.status === "active" && <Clock className="w-4 h-4" />}
                      <span className="capitalize font-medium">{position.status}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Potential: {position.potentialWin} STX
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
