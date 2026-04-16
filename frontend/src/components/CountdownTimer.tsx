"use client";

import { Timer } from "lucide-react";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  blocksRemaining: number;
  avgBlockTimeSeconds?: number;
}

export function CountdownTimer({ blocksRemaining, avgBlockTimeSeconds = 600 }: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(blocksRemaining * avgBlockTimeSeconds);

  useEffect(() => {
    setSecondsLeft(blocksRemaining * avgBlockTimeSeconds);
  }, [blocksRemaining, avgBlockTimeSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  if (blocksRemaining <= 0) {
    return (
      <span className="pill status-warning">
        <Timer className="h-3.5 w-3.5" />
        Ready to settle
      </span>
    );
  }

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  const display = days > 0
    ? `${days}d ${pad(hours)}h ${pad(minutes)}m`
    : `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;

  const urgencyClass =
    blocksRemaining <= 3 ? "text-red-300" :
    blocksRemaining <= 10 ? "text-amber-300" :
    "text-sky-300";

  return (
    <div className="flex items-center gap-2">
      <Timer className={`h-4 w-4 ${urgencyClass}`} />
      <span className={`font-mono text-sm font-semibold ${urgencyClass}`}>{display}</span>
    </div>
  );
}
