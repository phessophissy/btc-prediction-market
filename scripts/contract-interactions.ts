/**
 * BTC Prediction Market - Contract Interaction Script
 * 
 * This script simulates realistic user interactions with the prediction market:
 * - Creating markets
 * - Placing bets on different outcomes
 * - Settling markets
 * - Claiming winnings
 * 
 * Uses Clarinet SDK for local devnet testing.
 */

import { Cl, ClarityValue } from '@stacks/transactions';
import { describe, it, expect, beforeAll } from 'vitest';

// Test wallet addresses (from Clarinet devnet defaults)
const TEST_WALLETS = {
  deployer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  wallet1: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  wallet2: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  wallet3: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
  wallet4: 'ST2NEB84ASEZ1T45N3WVYH9Y41Z8K64QFSMVNV5D1',
  wallet5: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
  wallet6: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
  wallet7: 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ',
  wallet8: 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP',
  wallet9: 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6',
  wallet10: 'ST2VCQJHQFJS30TRZPGYPQ49WYQZXP0XGCA6RG8Y3'
};

// Contract constants (matching the Clarity contract)
const CONTRACT_NAME = 'btc-prediction-market';
const MARKET_CREATION_FEE = 5_000_000n; // 5 STX
const MIN_BET_AMOUNT = 1_000_000n; // 1 STX
const OUTCOME_A = 1n;
const OUTCOME_B = 2n;
const OUTCOME_C = 4n;
const OUTCOME_D = 8n;

// Interaction scenarios
interface MarketScenario {
  title: string;
  description: string;
  settlementBlocksFromNow: number;
  bets: {
    wallet: string;
    outcome: 'A' | 'B' | 'C' | 'D';
    amount: bigint;
  }[];
}

const scenarios: MarketScenario[] = [
  {
    title: 'BTC Price Above $100k',
    description: 'Will Bitcoin price exceed $100,000 by end of Q1 2026?',
    settlementBlocksFromNow: 100,
    bets: [
      { wallet: 'wallet1', outcome: 'A', amount: 10_000_000n }, // 10 STX on Yes
      { wallet: 'wallet2', outcome: 'B', amount: 15_000_000n }, // 15 STX on No
      { wallet: 'wallet3', outcome: 'A', amount: 5_000_000n },  // 5 STX on Yes
      { wallet: 'wallet4', outcome: 'A', amount: 20_000_000n }, // 20 STX on Yes
      { wallet: 'wallet5', outcome: 'B', amount: 25_000_000n }, // 25 STX on No
    ]
  },
  {
    title: 'ETH Flips BTC Market Cap',
    description: 'Will Ethereum market cap exceed Bitcoin market cap in 2026?',
    settlementBlocksFromNow: 200,
    bets: [
      { wallet: 'wallet6', outcome: 'B', amount: 50_000_000n }, // 50 STX on No
      { wallet: 'wallet7', outcome: 'A', amount: 8_000_000n },  // 8 STX on Yes
      { wallet: 'wallet8', outcome: 'B', amount: 12_000_000n }, // 12 STX on No
      { wallet: 'wallet9', outcome: 'A', amount: 3_000_000n },  // 3 STX on Yes
      { wallet: 'wallet10', outcome: 'B', amount: 30_000_000n },// 30 STX on No
    ]
  },
  {
    title: 'Next Block Hash Prediction',
    description: 'Will the settlement block hash end in an even number?',
    settlementBlocksFromNow: 50,
    bets: [
      { wallet: 'wallet1', outcome: 'A', amount: 5_000_000n },
      { wallet: 'wallet2', outcome: 'A', amount: 7_000_000n },
      { wallet: 'wallet3', outcome: 'B', amount: 6_000_000n },
      { wallet: 'wallet4', outcome: 'B', amount: 8_000_000n },
      { wallet: 'wallet5', outcome: 'A', amount: 4_000_000n },
      { wallet: 'wallet6', outcome: 'B', amount: 10_000_000n },
      { wallet: 'wallet7', outcome: 'A', amount: 3_000_000n },
      { wallet: 'wallet8', outcome: 'B', amount: 9_000_000n },
      { wallet: 'wallet9', outcome: 'A', amount: 2_000_000n },
      { wallet: 'wallet10', outcome: 'B', amount: 11_000_000n },
    ]
  }
];

/**
 * Helper to get the bet function name based on outcome
 */
function getBetFunction(outcome: 'A' | 'B' | 'C' | 'D'): string {
  const functions: Record<string, string> = {
    'A': 'bet-outcome-a',
    'B': 'bet-outcome-b',
    'C': 'bet-outcome-c',
    'D': 'bet-outcome-d'
  };
  return functions[outcome];
}

/**
 * Helper to convert outcome letter to uint
 */
function outcomeToUint(outcome: 'A' | 'B' | 'C' | 'D'): bigint {
  const outcomes: Record<string, bigint> = {
    'A': OUTCOME_A,
    'B': OUTCOME_B,
    'C': OUTCOME_C,
    'D': OUTCOME_D
  };
  return outcomes[outcome];
}

/**
 * Format STX amount for display
 */
function formatSTX(microSTX: bigint): string {
  return `${Number(microSTX) / 1_000_000} STX`;
}

/**
 * Print interaction summary
 */
function printScenarioSummary(scenario: MarketScenario, marketId: number): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Market #${marketId}: ${scenario.title}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📝 ${scenario.description}`);
  console.log(`⏰ Settlement in ${scenario.settlementBlocksFromNow} blocks\n`);
  
  let totalOutcomeA = 0n;
  let totalOutcomeB = 0n;
  
  console.log(`📈 Bets:`);
  scenario.bets.forEach((bet, idx) => {
    console.log(`   ${idx + 1}. ${bet.wallet} → Outcome ${bet.outcome}: ${formatSTX(bet.amount)}`);
    if (bet.outcome === 'A') totalOutcomeA += bet.amount;
    else if (bet.outcome === 'B') totalOutcomeB += bet.amount;
  });
  
  const totalPool = totalOutcomeA + totalOutcomeB;
  console.log(`\n💰 Pool Summary:`);
  console.log(`   Outcome A Pool: ${formatSTX(totalOutcomeA)} (${((Number(totalOutcomeA) / Number(totalPool)) * 100).toFixed(1)}%)`);
  console.log(`   Outcome B Pool: ${formatSTX(totalOutcomeB)} (${((Number(totalOutcomeB) / Number(totalPool)) * 100).toFixed(1)}%)`);
  console.log(`   Total Pool: ${formatSTX(totalPool)}`);
}

// Export for use in Clarinet tests
export {
  TEST_WALLETS,
  CONTRACT_NAME,
  MARKET_CREATION_FEE,
  MIN_BET_AMOUNT,
  OUTCOME_A,
  OUTCOME_B,
  OUTCOME_C,
  OUTCOME_D,
  scenarios,
  getBetFunction,
  outcomeToUint,
  formatSTX,
  printScenarioSummary
};

// Main execution for standalone run
if (require.main === module) {
  console.log('\n🎰 BTC Prediction Market - Interaction Scenarios\n');
  console.log('This script defines test scenarios for the prediction market.');
  console.log('Run with Clarinet tests to execute actual contract interactions.\n');
  
  scenarios.forEach((scenario, idx) => {
    printScenarioSummary(scenario, idx);
  });
  
  console.log('\n✅ Use these scenarios in Clarinet tests or the interaction test file.\n');
}
