'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Users, DollarSign } from 'lucide-react';

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

/**
 * MarketAnalytics component displays market statistics and analytics
 */
export function MarketAnalytics({
  marketId,
  totalVolume,
  activeParticipants,
  averageBetSize,
  winProbability,
}: MarketAnalyticsProps) {
  const [historicalData, setHistoricalData] = useState<AnalyticsDataPoint[]>([]);

  useEffect(() => {
    // Simulate loading historical data
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
      color: 'bg-blue-500',
    },
    {
      label: 'Active Participants',
      value: activeParticipants.toString(),
      unit: 'users',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Average Bet',
      value: averageBetSize.toFixed(2),
      unit: 'STX',
      icon: BarChart3,
      color: 'bg-purple-500',
    },
    {
      label: 'Win Probability',
      value: (winProbability * 100).toFixed(1),
      unit: '%',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.label}
                </span>
                <div className={\ p-2 rounded-lg text-white}>
                  <IconComponent size={16} />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  {metric.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Data */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Volume Trend
        </h3>
        <div className="space-y-2">
          {historicalData.map((point, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-20">
                {point.label}
              </span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: \\\%,
                    }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                {point.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketAnalytics;
