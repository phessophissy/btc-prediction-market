"use client";

import { useEffect, useState } from "react";

export function LiveNowPill() {
  const [timeLabel, setTimeLabel] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const update = () => {
      setTimeLabel(formatter.format(new Date()));
    };

    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className="glass-strip text-sm text-slate-200">
      <span className="dot-indicator bg-emerald-300" />
      Live now {timeLabel || "syncing..."}
    </span>
  );
}
