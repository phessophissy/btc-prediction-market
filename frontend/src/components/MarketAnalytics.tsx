'use client';

import { useEffect, useState } from 'react';
import { BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react';

interface AnalyticsDataPoint {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface MarketAnalyticsProps {
  marketId: number;
  totalVolume: number;
  activeParticipants: number;
  averageBetSize: number;
  winProbability: number;
}

export function MarketAnalytics({
  marketId,
  totalVolume,
  activeParticipants,
  averageBetSize,
  winProbability,
}: MarketAnalyticsProps) {
  const [historicalData, setHistoricalData] = useState<AnalyticsDataPoint[]>([]);

  useEffect(() => {
    setHistoricalData([
      { label: '1h ago', value: totalVolume * 0.8, change: -5, trend: 'down' },
      { label: '30m ago', value: totalVolume * 0.9, change: -2, trend: 'down' },
      { label: 'Now', value: totalVolume, change: 0, trend: 'up' },
    ]);
  }, [totalVolume]);

  const metrics = [
    {
      label: 'Total Volume',
      value: totalVolume.toFixed(2),
      unit: 'STX',
      icon: DollarSign,
      colorClass: 'text-amber-300',
    },
    {
      label: 'Active Participants',
      value: activeParticipants.toString(),
      unit: 'users',
      icon: Users,
      colorClass: 'text-emerald-300',
    },
    {
      label: 'Average Bet',
      value: averageBetSize.toFixed(2),
      unit: 'STX',
      icon: BarChart3,
      colorClass: 'text-sky-300',
    },
    {
      label: 'Win Probability',
      value: (winProbability * 100).toFixed(1),
      unit: '%',
      icon: TrendingUp,
      colorClass: 'text-rose-300',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Analytics snapshot</span>
        <span className="text-sm text-slate-400">Market #{marketId}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <div key={metric.label} className="card">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-slate-300">{metric.label}</span>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                  <IconComponent className={`h-4 w-4 ${metric.colorClass}`} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-semibold text-white">{metric.value}</span>
                <span className="pb-1 text-sm text-slate-400">{metric.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 className="mb-4 text-3xl">Volume trend</h3>
        <div className="space-y-4">
          {historicalData.map((point) => (
            <div key={point.label} className="flex items-center gap-4">
              <span className="w-20 text-sm text-slate-300">{point.label}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300"
                  style={{
                    width: `${totalVolume > 0 ? (point.value / totalVolume) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="w-20 text-right text-sm text-white">{point.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketAnalytics;
