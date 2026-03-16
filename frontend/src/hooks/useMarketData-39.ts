/**
 * React hook for market data fetching — variant 39
 */
import { useEffect, useState, useCallback } from 'react';

interface MarketSummary {
  id: number;
  title: string;
  totalPool: number;
  settled: boolean;
  blocksRemaining: number;
}

interface UseMarketDataResult {
  markets: MarketSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useMarketData(autoRefreshMs = 30000): UseMarketDataResult {
  const [markets, setMarkets] = useState<MarketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Placeholder: in production, call contractService.fetchMarkets()
      setMarkets([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch markets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (autoRefreshMs > 0) {
      const interval = setInterval(fetchData, autoRefreshMs);
      return () => clearInterval(interval);
    }
  }, [fetchData, autoRefreshMs]);

  return { markets, loading, error, refresh: fetchData };
}

export default useMarketData;
