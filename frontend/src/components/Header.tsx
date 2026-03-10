"use client";

import { useStacksAuth } from "@/contexts/StacksAuthContext";
import { formatAddress } from "@/lib/format";
import { Bitcoin, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const { isConnected, stxAddress, connect, disconnect } = useStacksAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Markets" },
    { href: "/create", label: "Create" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  const navClassName = (href: string) =>
    pathname === href
      ? "rounded-full bg-white/12 px-4 py-2 text-white"
      : "rounded-full px-4 py-2 text-slate-300 transition hover:bg-white/8 hover:text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/45 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/25 bg-gradient-to-br from-amber-300/25 via-rose-400/20 to-sky-400/25 shadow-lg shadow-amber-500/10">
              <Bitcoin className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">BTC Predict</span>
                <span className="eyebrow hidden sm:inline-flex">
                  <Sparkles className="h-3.5 w-3.5" />
                  Live on Stacks
                </span>
              </div>
              <p className="hidden text-sm text-slate-400 sm:block">
                Color-coded Bitcoin prediction markets
              </p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navClassName(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          {isConnected ? (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/6 p-1.5 pl-4">
              <span className="text-sm text-slate-300">
                {formatAddress(stxAddress || "")}
              </span>
              <button onClick={disconnect} className="btn-secondary px-4 py-2 text-xs">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connect} className="btn-primary">
              Connect Wallet
            </button>
          )}
        </div>

        <button
          className="rounded-2xl border border-white/10 bg-white/6 p-3 text-white md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mx-4 mb-4 rounded-[1.75rem] border border-white/10 bg-slate-950/85 p-4 shadow-2xl shadow-slate-950/30 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navClassName(item.href)}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-white/10 pt-3">
              {isConnected ? (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-slate-300">
                    {formatAddress(stxAddress || "")}
                  </span>
                  <button onClick={disconnect} className="btn-secondary w-full">
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
    </header>
  );
}
