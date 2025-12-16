"use client";

import { useStacksAuth } from "@/contexts/StacksAuthContext";
import { Bitcoin, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const { isConnected, stxAddress, connect, disconnect } = useStacksAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Bitcoin className="w-8 h-8 text-bitcoin" />
            <span className="font-bold text-xl">BTC Predict</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-300 hover:text-white transition">
              Markets
            </Link>
            <Link href="/create" className="text-slate-300 hover:text-white transition">
              Create
            </Link>
            <Link href="/portfolio" className="text-slate-300 hover:text-white transition">
              Portfolio
            </Link>
            <Link href="/leaderboard" className="text-slate-300 hover:text-white transition">
              Leaderboard
            </Link>
          </nav>

          {/* Connect Button */}
          <div className="hidden md:block">
            {isConnected ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">
                  {truncateAddress(stxAddress || "")}
                </span>
                <button onClick={disconnect} className="btn-secondary text-sm">
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={connect} className="btn-primary">
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-slate-300 hover:text-white transition">
                Markets
              </Link>
              <Link href="/create" className="text-slate-300 hover:text-white transition">
                Create
              </Link>
              <Link href="/portfolio" className="text-slate-300 hover:text-white transition">
                Portfolio
              </Link>
              <Link href="/leaderboard" className="text-slate-300 hover:text-white transition">
                Leaderboard
              </Link>
              <div className="pt-4 border-t border-slate-700">
                {isConnected ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-slate-400">
                      {truncateAddress(stxAddress || "")}
                    </span>
                    <button onClick={disconnect} className="btn-secondary">
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button onClick={connect} className="btn-primary w-full">
                    Connect Wallet
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
