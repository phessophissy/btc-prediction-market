"use client";

import { useStacksAuth } from "@/contexts/StacksAuthContext";
import { Plus } from "lucide-react";
import Link from "next/link";

export function CreateMarketButton() {
  const { isConnected, connect } = useStacksAuth();

  if (!isConnected) {
    return (
      <button onClick={connect} className="btn-primary inline-flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Connect to Create Market
      </button>
    );
  }

  return (
    <Link href="/create" className="btn-primary inline-flex items-center gap-2">
      <Plus className="w-5 h-5" />
      Create New Market
    </Link>
  );
}
