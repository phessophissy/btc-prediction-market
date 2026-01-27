/**
 * Contract Service for Bitcoin Prediction Market
 * Handles all read-only and transaction interactions with the smart contract
 */

import {
  cvToJSON,
  hexToCV,
  uintCV,
  standardPrincipalCV,
} from "@stacks/transactions";
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  STACKS_API_URL,
  OUTCOME_A,
  OUTCOME_B,
  OUTCOME_C,
  OUTCOME_D,
} from "./constants";

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
      arguments: args.map((arg) => arg.toString()),
    }),
  });

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
export async function fetchMarket(marketId: number): Promise<Market | null> {
  try {
    const result = await callReadOnly("get-market", [uintCV(marketId)]);
    
    if (!result || !result.value) {
      return null;
    }

    const m = result.value;
    const currentBurnHeight = await getCurrentBurnHeight();
    const possibleOutcomes = parseInt(m["possible-outcomes"]?.value) || 3;

    return {
      id: marketId,
      creator: m.creator?.value || "",
      title: hexToString(m.title?.value) || m.title?.value || "",
      description: hexToString(m.description?.value) || m.description?.value || "",
      settlementHeight: parseInt(m["settlement-burn-height"]?.value) || 0,
      settlementType: m["settlement-type"]?.value || "hash-even-odd",
      possibleOutcomes,
      totalPool: parseInt(m["total-pool"]?.value) || 0,
      outcomeAPool: parseInt(m["outcome-a-pool"]?.value) || 0,
      outcomeBPool: parseInt(m["outcome-b-pool"]?.value) || 0,
      outcomeCPool: parseInt(m["outcome-c-pool"]?.value) || 0,
      outcomeDPool: parseInt(m["outcome-d-pool"]?.value) || 0,
      winningOutcome: m["winning-outcome"]?.value?.value 
        ? parseInt(m["winning-outcome"].value.value) 
        : null,
      settled: m.settled?.value === true || m.settled?.value === "true",
      settledAtBurnHeight: m["settled-at-burn-height"]?.value?.value
        ? parseInt(m["settled-at-burn-height"].value.value)
        : null,
      settlementBlockHash: m["settlement-block-hash"]?.value?.value || null,
      createdAtBurnHeight: parseInt(m["created-at-burn-height"]?.value) || 0,
      createdAtStacksHeight: parseInt(m["created-at-stacks-height"]?.value) || 0,
      type: getMarketType(possibleOutcomes),
      currentBurnHeight,
    };
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
    const count = await getMarketCount();
    const markets: Market[] = [];

    // Fetch markets in parallel (batches of 10)
    const batchSize = 10;
    for (let i = 0; i < count; i += batchSize) {
      const batch = [];
      for (let j = i; j < Math.min(i + batchSize, count); j++) {
        batch.push(fetchMarket(j));
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
    const result = await callReadOnly("get-market-odds", [uintCV(marketId)]);
    
    if (!result || !result.value) {
      return null;
    }

    const o = result.value;
    return {
      outcomeAOdds: parseInt(o["outcome-a-odds"]?.value) || 0,
      outcomeBOdds: parseInt(o["outcome-b-odds"]?.value) || 0,
      outcomeCOdds: parseInt(o["outcome-c-odds"]?.value) || 0,
      outcomeDOdds: parseInt(o["outcome-d-odds"]?.value) || 0,
      totalPool: parseInt(o["total-pool"]?.value) || 0,
    };
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
    const result = await callReadOnly("is-market-settleable", [uintCV(marketId)]);
    return result?.value === true || result?.value === "true";
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
    const result = await callReadOnly("get-blocks-until-settlement", [uintCV(marketId)]);
    return parseInt(result?.value) || 0;
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
    const result = await callReadOnly("calculate-potential-payout", [
      uintCV(marketId),
      uintCV(outcome),
      uintCV(betAmount),
    ]);

    if (!result || !result.value) {
      return null;
    }

    const p = result.value;
    return {
      grossPayout: parseInt(p["gross-payout"]?.value) || 0,
      platformFee: parseInt(p["platform-fee"]?.value) || 0,
      netPayout: parseInt(p["net-payout"]?.value) || 0,
    };
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
export async function getUserPositions(userAddress: string): Promise<{
  position: UserPosition;
  market: Market;
}[]> {
  try {
    const markets = await fetchMarkets();
    const positions: { position: UserPosition; market: Market }[] = [];

    // Check each market for user position
    const positionPromises = markets.map(async (market) => {
      const position = await getUserPosition(market.id, userAddress);
      if (position && position.totalInvested > 0) {
        return { position, market };
      }
      return null;
    });

    const results = await Promise.all(positionPromises);
    return results.filter((r): r is { position: UserPosition; market: Market } => r !== null);
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
    const result = await callReadOnly("get-user-stats", [
      standardPrincipalCV(userAddress),
    ]);

    if (!result || !result.value) {
      return {
        marketsCreated: 0,
        totalBetsPlaced: 0,
        totalWinnings: 0,
        totalLosses: 0,
        achievements: 0,
      };
    }

    const s = result.value;
    return {
      marketsCreated: parseInt(s["markets-created"]?.value) || 0,
      totalBetsPlaced: parseInt(s["total-bets-placed"]?.value) || 0,
      totalWinnings: parseInt(s["total-winnings"]?.value) || 0,
      totalLosses: parseInt(s["total-losses"]?.value) || 0,
      achievements: parseInt(s["achievements"]?.value) || 0,
    };
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
  return (microSTX / 1_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Format blocks remaining to time string
 */
export function formatBlocksToTime(blocks: number): string {
  const minutes = blocks * 10; // ~10 min per BTC block
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
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
