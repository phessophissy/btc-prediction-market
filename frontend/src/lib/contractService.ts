/**
 * Contract Service for Bitcoin Prediction Market
 * Handles all read-only and transaction interactions with the smart contract
 */

import {
  cvToHex,
  cvToJSON,
  hexToCV,
  uintCV,
  standardPrincipalCV,
} from "@stacks/transactions";
import {
  CONTRACT_ADDRESS,
  CONTRACT_CAPABILITIES,
  CONTRACT_NAME,
  OUTCOME_A,
  OUTCOME_B,
  OUTCOME_C,
  OUTCOME_D,
  PLATFORM_FEE_PERCENT,
  STACKS_API_URL,
} from "./constants";
import { formatBlocksToEta, formatMicroStx } from "./format";

// ============================================
// Types
// ============================================

export interface Market {
  id: number;
  creator: string;
  title: string;
  description: string;
  settlementHeight: number;
  settlementType: string;
  possibleOutcomes: number;
  totalPool: number;
  outcomeAPool: number;
  outcomeBPool: number;
  outcomeCPool: number;
  outcomeDPool: number;
  winningOutcome: number | null;
  settled: boolean;
  settledAtBurnHeight: number | null;
  settlementBlockHash: string | null;
  createdAtBurnHeight: number;
  createdAtStacksHeight: number;
  type: "binary" | "multi";
  currentBurnHeight: number;
}

export interface UserPosition {
  marketId: number;
  outcomeAAmount: number;
  outcomeBAmount: number;
  outcomeCAmount: number;
  outcomeDAmount: number;
  totalInvested: number;
  claimed: boolean;
}

export interface UserStats {
  marketsCreated: number;
  totalBetsPlaced: number;
  totalWinnings: number;
  totalLosses: number;
  achievements: number;
}

export interface MarketOdds {
  outcomeAOdds: number;
  outcomeBOdds: number;
  outcomeCOdds: number;
  outcomeDOdds: number;
  totalPool: number;
}

export interface PlatformStats {
  totalMarkets: number;
  totalVolume: number;
  totalFeesCollected: number;
}

export interface PotentialPayout {
  grossPayout: number;
  platformFee: number;
  netPayout: number;
}

interface UserPositionWithMarket {
  position: UserPosition;
  market: Market;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Call a read-only contract function
 */
async function callReadOnly(functionName: string, args: any[] = []): Promise<any> {
  const url = `${STACKS_API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${functionName}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: CONTRACT_ADDRESS,
      arguments: args.map((arg) => cvToHex(arg)),
    }),
  });

  if (!response.ok) {
    throw new Error(`Read-only call failed with HTTP ${response.status}`);
  }

  const data = await response.json();
  
  if (data.okay && data.result) {
    return cvToJSON(hexToCV(data.result));
  }
  
  throw new Error(data.cause || "Contract call failed");
}

/**
 * Get current Bitcoin burn block height
 */
export async function getCurrentBurnHeight(): Promise<number> {
  try {
    const result = await callReadOnly("get-current-burn-height", []);
    return parseInt(result.value) || 0;
  } catch (error) {
    console.error("Error getting burn height:", error);
    // Fallback: fetch from API
    try {
      const response = await fetch(`${STACKS_API_URL}/v2/info`);
      const info = await response.json();
      return info.burn_block_height || 0;
    } catch {
      return 0;
    }
  }
}

/**
 * Decode hex string to readable string
 */
function hexToString(hex: string): string {
  if (!hex) return "";
  // Handle Clarity string format
  if (typeof hex === "string" && !hex.startsWith("0x")) {
    return hex;
  }
  if (!hex.startsWith("0x")) return hex;
  let str = "";
  for (let i = 2; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substr(i, 2), 16);
    if (charCode > 0) str += String.fromCharCode(charCode);
  }
  return str;
}

/**
 * Determine if market is binary or multi-outcome
 */
function getMarketType(possibleOutcomes: number): "binary" | "multi" {
  // Count enabled outcomes using bitwise flags
  let count = 0;
  if (possibleOutcomes & OUTCOME_A) count++;
  if (possibleOutcomes & OUTCOME_B) count++;
  if (possibleOutcomes & OUTCOME_C) count++;
  if (possibleOutcomes & OUTCOME_D) count++;
  return count <= 2 ? "binary" : "multi";
}

function parseIntValue(value: { value?: string } | undefined, fallback = 0): number {
  const parsed = Number.parseInt(value?.value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseOptionalIntValue(
  value: { value?: { value?: string } } | undefined
): number | null {
  if (!value?.value?.value) return null;
  const parsed = Number.parseInt(value.value.value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBoolValue(value: { value?: boolean | string } | undefined): boolean {
  return value?.value === true || value?.value === "true";
}

function getOutcomePool(market: Pick<Market, "outcomeAPool" | "outcomeBPool" | "outcomeCPool" | "outcomeDPool">, outcome: number): number {
  switch (outcome) {
    case OUTCOME_A:
      return market.outcomeAPool;
    case OUTCOME_B:
      return market.outcomeBPool;
    case OUTCOME_C:
      return market.outcomeCPool;
    case OUTCOME_D:
      return market.outcomeDPool;
    default:
      return 0;
  }
}

function getWinningPositionAmount(position: UserPosition, winningOutcome: number): number {
  switch (winningOutcome) {
    case OUTCOME_A:
      return position.outcomeAAmount;
    case OUTCOME_B:
      return position.outcomeBAmount;
    case OUTCOME_C:
      return position.outcomeCAmount;
    case OUTCOME_D:
      return position.outcomeDAmount;
    default:
      return 0;
  }
}

export function getEnabledOutcomes(possibleOutcomes: number): number[] {
  return [OUTCOME_A, OUTCOME_B, OUTCOME_C, OUTCOME_D].filter(
    (outcome) => (possibleOutcomes & outcome) === outcome
  );
}

function parseMarketValue(marketId: number, value: Record<string, any>, currentBurnHeight: number): Market {
  const possibleOutcomes = parseIntValue(
    value["possible-outcomes"],
    OUTCOME_A | OUTCOME_B
  );

  return {
    id: marketId,
    creator: value.creator?.value || "",
    title: hexToString(value.title?.value) || value.title?.value || "",
    description: hexToString(value.description?.value) || value.description?.value || "",
    settlementHeight: parseIntValue(value["settlement-burn-height"]),
    settlementType: value["settlement-type"]?.value || "hash-even-odd",
    possibleOutcomes,
    totalPool: parseIntValue(value["total-pool"]),
    outcomeAPool: parseIntValue(value["outcome-a-pool"]),
    outcomeBPool: parseIntValue(value["outcome-b-pool"]),
    outcomeCPool: parseIntValue(value["outcome-c-pool"]),
    outcomeDPool: parseIntValue(value["outcome-d-pool"]),
    winningOutcome: parseOptionalIntValue(value["winning-outcome"]),
    settled: parseBoolValue(value.settled),
    settledAtBurnHeight: parseOptionalIntValue(value["settled-at-burn-height"]),
    settlementBlockHash: value["settlement-block-hash"]?.value?.value || null,
    createdAtBurnHeight: parseIntValue(value["created-at-burn-height"]),
    createdAtStacksHeight: parseIntValue(value["created-at-stacks-height"]),
    type: getMarketType(possibleOutcomes),
    currentBurnHeight,
  };
}

export function calculateMarketOddsFromPools(
  market: Pick<
    Market,
    "possibleOutcomes" | "totalPool" | "outcomeAPool" | "outcomeBPool" | "outcomeCPool" | "outcomeDPool"
  >
): MarketOdds {
  const calculateOdds = (outcome: number) => {
    const outcomePool = getOutcomePool(market, outcome);
    if (!getEnabledOutcomes(market.possibleOutcomes).includes(outcome) || outcomePool <= 0) {
      return 0;
    }

    return Number((market.totalPool / outcomePool).toFixed(2));
  };

  return {
    outcomeAOdds: calculateOdds(OUTCOME_A),
    outcomeBOdds: calculateOdds(OUTCOME_B),
    outcomeCOdds: calculateOdds(OUTCOME_C),
    outcomeDOdds: calculateOdds(OUTCOME_D),
    totalPool: market.totalPool,
  };
}

export function calculatePotentialPayoutFromMarket(
  market: Pick<
    Market,
    "possibleOutcomes" | "totalPool" | "outcomeAPool" | "outcomeBPool" | "outcomeCPool" | "outcomeDPool"
  >,
  outcome: number,
  betAmount: number
): PotentialPayout | null {
  if (betAmount <= 0) {
    return {
      grossPayout: 0,
      platformFee: 0,
      netPayout: 0,
    };
  }

  if (!getEnabledOutcomes(market.possibleOutcomes).includes(outcome)) {
    return null;
  }

  const currentPool = getOutcomePool(market, outcome);
  const newPool = currentPool + betAmount;
  const newTotal = market.totalPool + betAmount;
  const grossPayout = newPool === 0 ? 0 : Math.floor((betAmount * newTotal) / newPool);
  const platformFee = Math.floor((grossPayout * PLATFORM_FEE_PERCENT) / 10_000);

  return {
    grossPayout,
    platformFee,
    netPayout: grossPayout - platformFee,
  };
}

function calculateSettledPositionNetPayout(
  market: Pick<Market, "winningOutcome" | "totalPool" | "outcomeAPool" | "outcomeBPool" | "outcomeCPool" | "outcomeDPool">,
  position: UserPosition
): number {
  if (market.winningOutcome === null) {
    return 0;
  }

  const winningAmount = getWinningPositionAmount(position, market.winningOutcome);
  const winningPool = getOutcomePool(market, market.winningOutcome);

  if (winningAmount <= 0 || winningPool <= 0) {
    return 0;
  }

  const grossPayout = Math.floor((winningAmount * market.totalPool) / winningPool);
  const platformFee = Math.floor((grossPayout * PLATFORM_FEE_PERCENT) / 10_000);
  return grossPayout - platformFee;
}

export function deriveUserStatsFromPositions(
  userAddress: string,
  markets: Market[],
  positions: UserPositionWithMarket[]
): UserStats {
  const marketsCreated = markets.filter((market) => market.creator === userAddress).length;
  const totalBetsPlaced = positions.reduce(
    (sum, { position }) => sum + position.totalInvested,
    0
  );
  const settledPositions = positions.filter(({ market }) => market.settled);
  const totalWinnings = settledPositions.reduce((sum, { market, position }) => {
    return sum + calculateSettledPositionNetPayout(market, position);
  }, 0);
  const totalLosses = settledPositions.reduce((sum, { market, position }) => {
    if (market.winningOutcome === null) {
      return sum;
    }

    return getWinningPositionAmount(position, market.winningOutcome) > 0
      ? sum
      : sum + position.totalInvested;
  }, 0);

  return {
    marketsCreated,
    totalBetsPlaced,
    totalWinnings,
    totalLosses,
    achievements: 0,
  };
}

// ============================================
// Market Functions
// ============================================

/**
 * Get total number of markets created
 */
export async function getMarketCount(): Promise<number> {
  try {
    const result = await callReadOnly("get-market-count", []);
    return parseInt(result.value) || 0;
  } catch (error) {
    console.error("Error getting market count:", error);
    return 0;
  }
}

/**
 * Fetch a single market by ID
 */
export async function fetchMarket(
  marketId: number,
  currentBurnHeight?: number
): Promise<Market | null> {
  try {
    const result = await callReadOnly("get-market", [uintCV(marketId)]);
    
    if (!result || !result.value) {
      return null;
    }

    const resolvedBurnHeight = currentBurnHeight ?? (await getCurrentBurnHeight());
    return parseMarketValue(marketId, result.value, resolvedBurnHeight);
  } catch (error) {
    console.error(`Error fetching market ${marketId}:`, error);
    return null;
  }
}

/**
 * Fetch all markets
 */
export async function fetchMarkets(): Promise<Market[]> {
  try {
    const [count, currentBurnHeight] = await Promise.all([
      getMarketCount(),
      getCurrentBurnHeight(),
    ]);
    const markets: Market[] = [];

    // Fetch markets in parallel (batches of 10)
    const batchSize = 10;
    for (let i = 0; i < count; i += batchSize) {
      const batch = [];
      for (let j = i; j < Math.min(i + batchSize, count); j++) {
        batch.push(fetchMarket(j, currentBurnHeight));
      }
      const results = await Promise.all(batch);
      markets.push(...results.filter((m): m is Market => m !== null));
    }

    return markets;
  } catch (error) {
    console.error("Error fetching markets:", error);
    return [];
  }
}

/**
 * Fetch only active (unsettled) markets
 */
export async function fetchActiveMarkets(): Promise<Market[]> {
  const markets = await fetchMarkets();
  return markets.filter((m) => !m.settled);
}

/**
 * Fetch settled markets
 */
export async function fetchSettledMarkets(): Promise<Market[]> {
  const markets = await fetchMarkets();
  return markets.filter((m) => m.settled);
}

/**
 * Get market odds
 */
export async function getMarketOdds(marketId: number): Promise<MarketOdds | null> {
  try {
    const market = await fetchMarket(marketId);
    return market ? calculateMarketOddsFromPools(market) : null;
  } catch (error) {
    console.error("Error getting market odds:", error);
    return null;
  }
}

/**
 * Check if market is settleable
 */
export async function isMarketSettleable(marketId: number): Promise<boolean> {
  try {
    if (!CONTRACT_CAPABILITIES.settleMarkets) {
      return false;
    }

    const market = await fetchMarket(marketId);
    if (!market || market.settled) {
      return false;
    }

    return market.currentBurnHeight >= market.settlementHeight;
  } catch (error) {
    console.error("Error checking if market settleable:", error);
    return false;
  }
}

/**
 * Get blocks until settlement
 */
export async function getBlocksUntilSettlement(marketId: number): Promise<number> {
  try {
    const market = await fetchMarket(marketId);
    if (!market) {
      return 0;
    }

    return Math.max(market.settlementHeight - market.currentBurnHeight, 0);
  } catch (error) {
    console.error("Error getting blocks until settlement:", error);
    return 0;
  }
}

/**
 * Calculate potential payout for a bet
 */
export async function calculatePotentialPayout(
  marketId: number,
  outcome: number,
  betAmount: number
): Promise<PotentialPayout | null> {
  try {
    const market = await fetchMarket(marketId);
    return market ? calculatePotentialPayoutFromMarket(market, outcome, betAmount) : null;
  } catch (error) {
    console.error("Error calculating potential payout:", error);
    return null;
  }
}

// ============================================
// User Functions
// ============================================

/**
 * Get user's position in a market
 */
export async function getUserPosition(
  marketId: number,
  userAddress: string
): Promise<UserPosition | null> {
  try {
    const result = await callReadOnly("get-user-position", [
      uintCV(marketId),
      standardPrincipalCV(userAddress),
    ]);

    if (!result || !result.value) {
      return null;
    }

    const p = result.value;
    return {
      marketId,
      outcomeAAmount: parseInt(p["outcome-a-amount"]?.value) || 0,
      outcomeBAmount: parseInt(p["outcome-b-amount"]?.value) || 0,
      outcomeCAmount: parseInt(p["outcome-c-amount"]?.value) || 0,
      outcomeDAmount: parseInt(p["outcome-d-amount"]?.value) || 0,
      totalInvested: parseInt(p["total-invested"]?.value) || 0,
      claimed: p.claimed?.value === true || p.claimed?.value === "true",
    };
  } catch (error) {
    console.error("Error getting user position:", error);
    return null;
  }
}

/**
 * Get all positions for a user across all markets
 */
async function getUserPositionsFromMarkets(
  markets: Market[],
  userAddress: string
): Promise<UserPositionWithMarket[]> {
  const positions: UserPositionWithMarket[] = [];

  // Check each market for user position
  const positionPromises = markets.map(async (market) => {
    const position = await getUserPosition(market.id, userAddress);
    if (position && position.totalInvested > 0) {
      return { position, market };
    }
    return null;
  });

  const results = await Promise.all(positionPromises);
  positions.push(...results.filter((r): r is UserPositionWithMarket => r !== null));
  return positions;
}

export async function getUserPositions(userAddress: string): Promise<UserPositionWithMarket[]> {
  try {
    const markets = await fetchMarkets();
    return getUserPositionsFromMarkets(markets, userAddress);
  } catch (error) {
    console.error("Error getting user positions:", error);
    return [];
  }
}

/**
 * Get user stats
 */
export async function getUserStats(userAddress: string): Promise<UserStats | null> {
  try {
    const markets = await fetchMarkets();
    const positions = await getUserPositionsFromMarkets(markets, userAddress);
    return deriveUserStatsFromPositions(userAddress, markets, positions);
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
}

// ============================================
// Platform Stats Functions
// ============================================

/**
 * Get total fees collected by platform
 */
export async function getTotalFeesCollected(): Promise<number> {
  try {
    const result = await callReadOnly("get-total-fees-collected", []);
    return parseInt(result?.value) || 0;
  } catch (error) {
    console.error("Error getting total fees:", error);
    return 0;
  }
}

/**
 * Get platform statistics
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const [marketCount, feesCollected, markets] = await Promise.all([
      getMarketCount(),
      getTotalFeesCollected(),
      fetchMarkets(),
    ]);

    // Calculate total volume from all market pools
    const totalVolume = markets.reduce((sum, m) => sum + m.totalPool, 0);

    return {
      totalMarkets: marketCount,
      totalVolume,
      totalFeesCollected: feesCollected,
    };
  } catch (error) {
    console.error("Error getting platform stats:", error);
    return {
      totalMarkets: 0,
      totalVolume: 0,
      totalFeesCollected: 0,
    };
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if a user can claim winnings for a market
 */
export async function canClaimWinnings(
  marketId: number,
  userAddress: string
): Promise<boolean> {
  try {
    if (!CONTRACT_CAPABILITIES.claimWinnings) {
      return false;
    }

    const [market, position] = await Promise.all([
      fetchMarket(marketId),
      getUserPosition(marketId, userAddress),
    ]);

    if (!market || !position) return false;
    if (!market.settled) return false;
    if (position.claimed) return false;
    if (position.totalInvested === 0) return false;

    // Check if user bet on the winning outcome
    const winningOutcome = market.winningOutcome;
    if (!winningOutcome) return false;

    if (winningOutcome === OUTCOME_A && position.outcomeAAmount > 0) return true;
    if (winningOutcome === OUTCOME_B && position.outcomeBAmount > 0) return true;
    if (winningOutcome === OUTCOME_C && position.outcomeCAmount > 0) return true;
    if (winningOutcome === OUTCOME_D && position.outcomeDAmount > 0) return true;

    return false;
  } catch (error) {
    console.error("Error checking claim eligibility:", error);
    return false;
  }
}

/**
 * Format microSTX to STX string
 */
export function formatSTX(microSTX: number): string {
  return formatMicroStx(microSTX);
}

/**
 * Format blocks remaining to time string
 */
export function formatBlocksToTime(blocks: number): string {
  return formatBlocksToEta(blocks);
}

/**
 * Get outcome label
 */
export function getOutcomeLabel(
  outcome: number,
  marketType: "binary" | "multi"
): string {
  if (marketType === "binary") {
    if (outcome === OUTCOME_A) return "Yes (Even)";
    if (outcome === OUTCOME_B) return "No (Odd)";
  } else {
    if (outcome === OUTCOME_A) return "Outcome A";
    if (outcome === OUTCOME_B) return "Outcome B";
    if (outcome === OUTCOME_C) return "Outcome C";
    if (outcome === OUTCOME_D) return "Outcome D";
  }
  return "Unknown";
}

// [docs/api-reference-guide] commit 4/10: extend lib layer – 1776638540297224521
