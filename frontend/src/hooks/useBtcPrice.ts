"use client";

import { useEffect, useState } from "react";

interface BtcPriceData {
  price: number | null;
  change24h: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch the current BTC price from the CoinGecko public API.
 * Polls every `intervalMs` (default 60s). Returns null while loading.
 */
export function useBtcPrice(intervalMs = 60_000): BtcPriceData {
  const [price, setPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrice() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        setPrice(data.bitcoin.usd);
        setChange24h(data.bitcoin.usd_24h_change);
        setError(null);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPrice();
    const id = setInterval(fetchPrice, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return { price, change24h, loading, error };
}

// [fix/market-expiry-display] commit 3/10: update hooks layer – 1776638446314624413
