"use client";

import { useStacksAuth } from "@/contexts/StacksAuthContext";
import { Bitcoin, Menu, X, Zap, Flame } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const { isConnected, stxAddress, connect, disconnect } = useStacksAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("markets");

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navItems = [
    { href: "/", label: "Markets", id: "markets" },
    { href: "/create", label: "Create", id: "create" },
    { href: "/portfolio", label: "Portfolio", id: "portfolio" },
    { href: "/leaderboard", label: "Leaderboard", id: "leaderboard" },
  ];

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Multi-layer background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/60 backdrop-blur-xl" />
        
        {/* Border glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        
        {/* Subtle animated background effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-red-500/5 animate-pulse" style={{ animationDuration: "4s" }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Premium Design */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg opacity-0 group-hover:opacity-20 blur-lg group-hover:blur-xl transition-all duration-500" />
                
                {/* Icon container */}
                <div className="relative bg-gradient-to-br from-gray-900 to-black p-2 rounded-lg border border-orange-500/30 group-hover:border-orange-500/80 transition-all duration-300">
                  <Zap className="w-6 h-6 text-orange-500 group-hover:text-yellow-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </div>
              </div>

              {/* Logo text - Premium Typography */}
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter leading-none group-hover:tracking-wider transition-all duration-300">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-white group-hover:from-yellow-400 group-hover:via-orange-400 group-hover:to-red-500 transition-all duration-300">
                    BTC
                  </span>
                </span>
                <span className="text-xs font-bold text-orange-400 group-hover:text-yellow-400 transition-colors duration-300 tracking-widest">
                  PREDICT
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => setActiveNav(item.id)}
                  className="relative px-4 py-2 group"
                >
                  {/* Background pill - hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-orange-500/40 transition-all duration-300" />
                  
                  {/* Text with gradient on hover */}
                  <span className="relative text-sm font-black tracking-wider text-gray-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-300 group-hover:to-red-500 transition-all duration-300 uppercase">
                    {item.label}
                  </span>

                  {/* Bottom accent line - animates in */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-0 group-hover:w-4/5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/50" />
                </Link>
              ))}
            </nav>

            {/* Connect Button - Premium Styling */}
            <div className="hidden lg:flex items-center gap-4">
              {isConnected ? (
                <>
                  {/* Address display */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-all duration-300" />
                    <div className="relative px-4 py-2 rounded-lg bg-gradient-to-r from-gray-900/80 to-black/80 border border-gray-700/50 group-hover:border-orange-500/50 transition-all duration-300 backdrop-blur-sm">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Wallet</span>
                      <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-mono">
                        {truncateAddress(stxAddress || "")}
                      </span>
                    </div>
                  </div>

                  {/* Disconnect button */}
                  <button
                    onClick={disconnect}
                    className="relative group px-4 py-2"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                    <div className="relative px-3 py-2 border border-red-500/50 group-hover:border-red-500 rounded-lg text-sm font-black text-red-400 group-hover:text-red-300 transition-all duration-300 uppercase tracking-wider">
                      Disconnect
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={connect}
                  className="relative group px-6 py-2 overflow-hidden rounded-lg font-black text-white uppercase tracking-wider text-sm"
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 group-hover:via-yellow-500 transition-all duration-500" />
                  
                  {/* Shine effect on hover */}
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse -skew-x-12 group-hover:translate-x-full transition-all duration-700" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-orange-500/80 transition-all duration-300 rounded-lg blur" />
                  
                  {/* Text */}
                  <span className="relative flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                    <Flame className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Connect
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 group relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="absolute -inset-2 bg-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all" />
              <div className="relative">
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
                ) : (
                  <Menu className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-6 border-t border-orange-500/20 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <nav className="flex flex-col gap-3 mb-6">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="relative px-4 py-3 group rounded-lg"
                  >
                    {/* Hover background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:to-orange-500/10 rounded-lg transition-all duration-300" />
                    
                    {/* Text */}
                    <span className="relative text-sm font-black text-gray-300 group-hover:text-orange-400 transition-colors uppercase tracking-wider">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="pt-6 border-t border-orange-500/20 space-y-3">
                {isConnected ? (
                  <>
                    <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-700/50">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Wallet</span>
                      <span className="text-sm font-mono text-orange-400">
                        {truncateAddress(stxAddress || "")}
                      </span>
                    </div>
                    <button
                      onClick={disconnect}
                      className="w-full px-4 py-2 text-sm font-black text-red-400 border border-red-500/50 hover:border-red-500 hover:text-red-300 rounded-lg transition-all duration-300 uppercase tracking-wider"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={connect}
                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black rounded-lg transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Flame className="w-4 h-4" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=IBM+Plex+Mono:wght@400;600;700&display=swap");

        header {
          font-family: "Orbitron", sans-serif;
        }

        header span.font-mono {
          font-family: "IBM Plex Mono", monospace;
        }

        /* Smooth animations */
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-20deg);
          }
          100% {
            transform: translateX(100%) skewX(-20deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        /* Custom cursor glow on hover */
        header button:hover,
        header a:hover {
          text-shadow: 0 0 8px rgba(249, 115, 22, 0.4);
        }
      `}</style>
    </header>
  );
}