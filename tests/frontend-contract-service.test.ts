// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  calculateMarketOddsFromPools,
  calculatePotentialPayoutFromMarket,
  deriveUserStatsFromPositions,
  getEnabledOutcomes,
  type Market,
  type UserPosition,
} from "../frontend/src/lib/contractService";
import { OUTCOME_A, OUTCOME_B, OUTCOME_C } from "../frontend/src/lib/constants";

function buildMarket(overrides: Partial<Market> = {}): Market {
  return {
    id: 1,
    creator: "SP123",
    title: "BTC parity",
    description: "Test market",
    settlementHeight: 100,
    settlementType: "hash-even-odd",
    possibleOutcomes: OUTCOME_A | OUTCOME_B,
    totalPool: 2_000_000,
    outcomeAPool: 500_000,
    outcomeBPool: 1_500_000,
    outcomeCPool: 0,
    outcomeDPool: 0,
    winningOutcome: null,
    settled: false,
    settledAtBurnHeight: null,
    settlementBlockHash: null,
    createdAtBurnHeight: 90,
    createdAtStacksHeight: 50,
    type: "binary",
    currentBurnHeight: 95,
    ...overrides,
  };
}

function buildPosition(overrides: Partial<UserPosition> = {}): UserPosition {
  return {
    marketId: 1,
    outcomeAAmount: 0,
    outcomeBAmount: 0,
    outcomeCAmount: 0,
    outcomeDAmount: 0,
    totalInvested: 0,
    claimed: false,
    ...overrides,
  };
}

describe("contractService derived helpers", () => {
  it("returns only enabled outcome flags", () => {
    expect(getEnabledOutcomes(OUTCOME_A | OUTCOME_C)).toEqual([OUTCOME_A, OUTCOME_C]);
  });

  it("calculates odds from existing market pools", () => {
    const odds = calculateMarketOddsFromPools(buildMarket());

    expect(odds).toEqual({
      outcomeAOdds: 4,
      outcomeBOdds: 1.33,
      outcomeCOdds: 0,
      outcomeDOdds: 0,
      totalPool: 2_000_000,
    });
  });

  it("derives a potential payout without relying on missing contract helpers", () => {
    const payout = calculatePotentialPayoutFromMarket(buildMarket(), OUTCOME_A, 250_000);

    expect(payout).toEqual({
      grossPayout: 750_000,
      platformFee: 22_500,
      netPayout: 727_500,
    });
  });

  it("rejects payouts for disabled outcomes", () => {
    expect(calculatePotentialPayoutFromMarket(buildMarket(), OUTCOME_C, 250_000)).toBeNull();
  });

  it("derives user stats from fetched positions and markets", () => {
    const winningMarket = buildMarket({
      id: 2,
      creator: "SP999",
      totalPool: 3_000_000,
      outcomeAPool: 1_000_000,
      outcomeBPool: 2_000_000,
      settled: true,
      winningOutcome: OUTCOME_A,
    });
    const losingMarket = buildMarket({
      id: 3,
      creator: "SP123",
      totalPool: 2_000_000,
      outcomeAPool: 1_000_000,
      outcomeBPool: 1_000_000,
      settled: true,
      winningOutcome: OUTCOME_B,
    });
    const openMarket = buildMarket({
      id: 4,
      creator: "SP123",
      settled: false,
      winningOutcome: null,
    });

    const stats = deriveUserStatsFromPositions(
      "SP123",
      [winningMarket, losingMarket, openMarket],
      [
        {
          market: winningMarket,
          position: buildPosition({
            marketId: 2,
            outcomeAAmount: 500_000,
            totalInvested: 500_000,
          }),
        },
        {
          market: losingMarket,
          position: buildPosition({
            marketId: 3,
            outcomeAAmount: 250_000,
            totalInvested: 250_000,
          }),
        },
      ]
    );

    expect(stats).toEqual({
      marketsCreated: 2,
      totalBetsPlaced: 750_000,
      totalWinnings: 1_455_000,
      totalLosses: 250_000,
      achievements: 0,
    });
  });
});

// [feat/market-templates] commit 8/10: augment test layer – 1776638382324373375
