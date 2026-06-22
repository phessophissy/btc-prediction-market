"use client";

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export function ConnectionBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-slide-up" role="alert">
      <div className="card flex items-center gap-4 border-amber-300/20 bg-slate-950/95 backdrop-blur-xl">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10">
          <WifiOff className="h-5 w-5 text-amber-300" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">Connection lost</p>
          <p className="text-xs text-slate-400">Market data may be outdated. Check your network.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary px-3 py-2 text-xs"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-400 hover:bg-white/5"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
