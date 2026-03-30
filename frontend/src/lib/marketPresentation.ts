import type { Market } from "./contractService";

export function getMarketLiquidityLabel(totalPool: number) {
  if (totalPool >= 10_000_000) return "Deep liquidity";
  if (totalPool >= 2_000_000) return "Healthy liquidity";
  if (totalPool > 0) return "Early liquidity";
  return "No liquidity";
}

export function getMarketUrgencyLabel(blocksRemaining: number) {
  if (blocksRemaining <= 0) return "Awaiting settlement";
  if (blocksRemaining <= 12) return "Closing soon";
  if (blocksRemaining <= 72) return "Active window";
  return "Long runway";
}

export function getMarketLeadOutcome(market: Pick<Market, "outcomeAPool" | "outcomeBPool" | "outcomeCPool" | "outcomeDPool" | "type">) {
  const entries =
    market.type === "binary"
      ? [
          { id: "A", pool: market.outcomeAPool },
          { id: "B", pool: market.outcomeBPool },
        ]
      : [
          { id: "A", pool: market.outcomeAPool },
          { id: "B", pool: market.outcomeBPool },
          { id: "C", pool: market.outcomeCPool },
          { id: "D", pool: market.outcomeDPool },
        ];

  return entries.sort((left, right) => right.pool - left.pool)[0];
}

export function getMarketMomentumLabel(market: Pick<Market, "totalPool" | "outcomeAPool" | "outcomeBPool" | "outcomeCPool" | "outcomeDPool" | "type">) {
  const lead = getMarketLeadOutcome(market);
  if (!lead || market.totalPool <= 0) return "Open price discovery";

  const share = lead.pool / market.totalPool;
  if (share >= 0.65) return `Outcome ${lead.id} dominates`;
  if (share >= 0.45) return `Outcome ${lead.id} leads`;
  return "Balanced liquidity";
}
