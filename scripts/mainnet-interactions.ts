/**
 * BTC Prediction Market - Mainnet Contract Interaction Script
 * 
 * This script provides functions to interact with the deployed mainnet contract:
 * - Creating markets
 * - Placing bets on different outcomes
 * - Settling markets
 * - Claiming winnings
 * 
 * Uses @stacks/transactions for mainnet interactions.
 */

import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  stringUtf8CV,
  principalCV,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  Cl,
  callReadOnlyFunction,
  cvToValue
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================
// MAINNET CONFIGURATION
// =============================================

const NETWORK = new StacksMainnet();
const CONTRACT_ADDRESS = 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09';
const CONTRACT_NAME = 'btc-prediction-market-v2';

// Contract constants (in microSTX)
const MARKET_CREATION_FEE = 5_000_000n; // 5 STX
const MIN_BET_AMOUNT = 1_000_000n; // 1 STX
const PLATFORM_FEE_PERCENT = 300n; // 3%

// Outcome constants
const OUTCOME_A = 1n;
const OUTCOME_B = 2n;
const OUTCOME_C = 4n;
const OUTCOME_D = 8n;

// =============================================
// WALLET LOADING
// =============================================

interface MainnetWallet {
  id: number;
  name: string;
  address: string;
  mnemonic: string;
  privateKey: string;
}

function loadWallets(): MainnetWallet[] {
  const walletsPath = path.join(__dirname, 'mainnet-wallets.json');
  if (!fs.existsSync(walletsPath)) {
    throw new Error('mainnet-wallets.json not found. Run generate-test-wallets.ts first.');
  }
  return JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));
}

// =============================================
// READ-ONLY FUNCTIONS
// =============================================

export async function getMarket(marketId: number) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-market',
    functionArgs: [uintCV(marketId)],
    network: NETWORK,
    senderAddress: CONTRACT_ADDRESS
  });
  return cvToValue(result);
}

export async function getMarketCount() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-market-count',
    functionArgs: [],
    network: NETWORK,
    senderAddress: CONTRACT_ADDRESS
  });
  return cvToValue(result);
}

export async function getUserPosition(marketId: number, userAddress: string) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-user-position',
    functionArgs: [uintCV(marketId), principalCV(userAddress)],
    network: NETWORK,
    senderAddress: CONTRACT_ADDRESS
  });
  return cvToValue(result);
}

export async function getMarketOdds(marketId: number) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-market-odds',
    functionArgs: [uintCV(marketId)],
    network: NETWORK,
    senderAddress: CONTRACT_ADDRESS
  });
  return cvToValue(result);
}

export async function getContractBalance() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-contract-balance',
    functionArgs: [],
    network: NETWORK,
    senderAddress: CONTRACT_ADDRESS
  });
  return cvToValue(result);
}

// =============================================
// TRANSACTION BUILDERS
// =============================================

export async function createBinaryMarket(
  senderKey: string,
  senderAddress: string,
  title: string,
  description: string,
  settlementBurnHeight: number
) {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-binary-market',
    functionArgs: [
      stringUtf8CV(title),
      stringUtf8CV(description),
      uintCV(settlementBurnHeight)
    ],
    senderKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        MARKET_CREATION_FEE
      )
    ],
    fee: 10000n // 0.01 STX fee
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, NETWORK);
  
  return {
    txId: result.txid,
    success: result.error ? false : true,
    error: result.error || null
  };
}

export async function placeBet(
  senderKey: string,
  senderAddress: string,
  marketId: number,
  outcome: 'A' | 'B' | 'C' | 'D',
  amount: bigint
) {
  const functionName = `bet-outcome-${outcome.toLowerCase()}`;
  
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs: [
      uintCV(marketId),
      uintCV(amount)
    ],
    senderKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        amount
      )
    ],
    fee: 10000n
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, NETWORK);
  
  return {
    txId: result.txid,
    success: result.error ? false : true,
    error: result.error || null
  };
}

export async function settleMarket(
  senderKey: string,
  marketId: number
) {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'settle-market',
    functionArgs: [uintCV(marketId)],
    senderKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 10000n
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, NETWORK);
  
  return {
    txId: result.txid,
    success: result.error ? false : true,
    error: result.error || null
  };
}

export async function claimWinnings(
  senderKey: string,
  marketId: number
) {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'claim-winnings',
    functionArgs: [uintCV(marketId)],
    senderKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 10000n
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, NETWORK);
  
  return {
    txId: result.txid,
    success: result.error ? false : true,
    error: result.error || null
  };
}

// =============================================
// INTERACTION SCENARIOS
// =============================================

interface BetScenario {
  walletIndex: number; // 1-10
  outcome: 'A' | 'B';
  amountSTX: number;
}

interface MarketScenario {
  title: string;
  description: string;
  settlementBlocksFromNow: number;
  creatorWalletIndex: number;
  bets: BetScenario[];
}

const SCENARIOS: MarketScenario[] = [
  {
    title: 'BTC Above $150k by Feb 2026',
    description: 'Will Bitcoin price exceed $150,000 USD by February 28, 2026?',
    settlementBlocksFromNow: 1000,
    creatorWalletIndex: 1,
    bets: [
      { walletIndex: 1, outcome: 'A', amountSTX: 10 },
      { walletIndex: 2, outcome: 'B', amountSTX: 15 },
      { walletIndex: 3, outcome: 'A', amountSTX: 5 },
      { walletIndex: 4, outcome: 'A', amountSTX: 20 },
      { walletIndex: 5, outcome: 'B', amountSTX: 25 },
    ]
  },
  {
    title: 'Stacks STX Above $5',
    description: 'Will STX token price exceed $5 USD by settlement block?',
    settlementBlocksFromNow: 500,
    creatorWalletIndex: 6,
    bets: [
      { walletIndex: 6, outcome: 'B', amountSTX: 50 },
      { walletIndex: 7, outcome: 'A', amountSTX: 8 },
      { walletIndex: 8, outcome: 'B', amountSTX: 12 },
      { walletIndex: 9, outcome: 'A', amountSTX: 3 },
      { walletIndex: 10, outcome: 'B', amountSTX: 30 },
    ]
  }
];

// =============================================
// MAIN EXECUTION
// =============================================

async function runInteractions() {
  console.log('\n' + '═'.repeat(60));
  console.log('🎰 BTC PREDICTION MARKET - MAINNET INTERACTIONS');
  console.log('═'.repeat(60));
  console.log(`\n📍 Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}\n`);

  // Load wallets
  let wallets: MainnetWallet[];
  try {
    wallets = loadWallets();
    console.log(`✅ Loaded ${wallets.length} mainnet wallets\n`);
  } catch (err) {
    console.error('❌ Failed to load wallets:', err);
    console.log('\n📝 Run this first: npx ts-node scripts/generate-test-wallets.ts\n');
    return;
  }

  // Display wallet addresses
  console.log('📋 Wallet Addresses:');
  wallets.forEach(w => {
    console.log(`   ${w.id}. ${w.name}: ${w.address}`);
  });

  // Check current market count
  try {
    const marketCount = await getMarketCount();
    console.log(`\n📊 Current markets on contract: ${marketCount}`);
  } catch (err) {
    console.log('\n⚠️  Could not fetch market count (contract may not be deployed yet)');
  }

  // Display scenarios
  console.log('\n' + '─'.repeat(60));
  console.log('📝 INTERACTION SCENARIOS');
  console.log('─'.repeat(60));

  for (const [idx, scenario] of SCENARIOS.entries()) {
    console.log(`\n🎯 Scenario ${idx + 1}: ${scenario.title}`);
    console.log(`   ${scenario.description}`);
    console.log(`   Creator: Wallet ${scenario.creatorWalletIndex}`);
    console.log(`   Settlement: +${scenario.settlementBlocksFromNow} blocks`);
    
    let totalA = 0, totalB = 0;
    console.log(`   Bets:`);
    scenario.bets.forEach(bet => {
      console.log(`      - Wallet ${bet.walletIndex}: ${bet.amountSTX} STX on ${bet.outcome}`);
      if (bet.outcome === 'A') totalA += bet.amountSTX;
      else totalB += bet.amountSTX;
    });
    console.log(`   Pool: A=${totalA} STX, B=${totalB} STX, Total=${totalA + totalB} STX`);
  }

  console.log('\n' + '─'.repeat(60));
  console.log('⚠️  DRY RUN MODE - No transactions broadcast');
  console.log('─'.repeat(60));
  console.log('\nTo execute transactions, uncomment the execution code in the script.');
  console.log('Make sure each wallet has sufficient STX balance first!\n');

  // UNCOMMENT BELOW TO EXECUTE REAL TRANSACTIONS
  /*
  console.log('\n🚀 EXECUTING TRANSACTIONS...\n');
  
  for (const scenario of SCENARIOS) {
    const creatorWallet = wallets[scenario.creatorWalletIndex - 1];
    
    // Get current burn height (you'd need to fetch this from the API)
    const currentBurnHeight = 875000; // Replace with actual
    const settlementHeight = currentBurnHeight + scenario.settlementBlocksFromNow;
    
    console.log(`\n📝 Creating market: ${scenario.title}`);
    const createResult = await createBinaryMarket(
      creatorWallet.privateKey,
      creatorWallet.address,
      scenario.title,
      scenario.description,
      settlementHeight
    );
    
    if (createResult.success) {
      console.log(`   ✅ TX: ${createResult.txId}`);
      
      // Wait for confirmation...
      // Then place bets
      for (const bet of scenario.bets) {
        const betWallet = wallets[bet.walletIndex - 1];
        const amountMicroSTX = BigInt(bet.amountSTX * 1_000_000);
        
        console.log(`   💰 ${betWallet.name} betting ${bet.amountSTX} STX on ${bet.outcome}`);
        const betResult = await placeBet(
          betWallet.privateKey,
          betWallet.address,
          0, // market ID - would need to track this
          bet.outcome,
          amountMicroSTX
        );
        
        if (betResult.success) {
          console.log(`      ✅ TX: ${betResult.txId}`);
        } else {
          console.log(`      ❌ Error: ${betResult.error}`);
        }
      }
    } else {
      console.log(`   ❌ Error: ${createResult.error}`);
    }
  }
  */
}

// Export for module use
export {
  NETWORK,
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  MARKET_CREATION_FEE,
  MIN_BET_AMOUNT,
  SCENARIOS,
  loadWallets,
  runInteractions
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runInteractions().catch(console.error);
}
