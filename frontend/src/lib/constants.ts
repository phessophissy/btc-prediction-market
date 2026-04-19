import { StacksMainnet, StacksTestnet } from "@stacks/network";

const networkName =
  (process.env.NEXT_PUBLIC_NETWORK || "mainnet").toLowerCase() === "testnet"
    ? "testnet"
    : "mainnet";

export const IS_MAINNET = networkName === "mainnet";
export const NETWORK_NAME = networkName;
export const NETWORK = IS_MAINNET ? new StacksMainnet() : new StacksTestnet();

// Contract configuration - defaults to the deployed V3 mainnet contract
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09";
export const CONTRACT_NAME =
  process.env.NEXT_PUBLIC_CONTRACT_NAME || "btc-prediction-market-v5";
export const TOKEN_CONTRACT_NAME = "prediction-token";
export const TRAIT_CONTRACT_NAME = "sip-010-trait";

// Old contract (deprecated - DO NOT USE)
export const OLD_CONTRACT_ADDRESS = "SP31G2FZ5JN87BATZMP4ZRYE5F7WZQDNEXJ7G7X97";

// Fee constants (matching the deployed V3 contract)
export const MARKET_CREATION_FEE = 100000; // 0.1 STX in microSTX
export const PLATFORM_FEE_PERCENT = 300; // 3% in basis points
export const MIN_BET_AMOUNT = 10000; // 0.01 STX minimum bet

// Outcome constants
export const OUTCOME_A = 1;
export const OUTCOME_B = 2;
export const OUTCOME_C = 4;
export const OUTCOME_D = 8;

// API endpoints
export const STACKS_API_URL = IS_MAINNET 
  ? "https://api.mainnet.hiro.so"
  : "https://api.testnet.hiro.so";

export const BTC_EXPLORER_URL = IS_MAINNET
  ? "https://mempool.space"
  : "https://mempool.space/testnet";

// Current V3 deployment does not expose bet/settle/claim entrypoints yet.
export const CONTRACT_CAPABILITIES = {
  createMarkets: true,
  placeBets: false,
  settleMarkets: false,
  claimWinnings: false,
  onChainUserStats: false,
} as const;

// [docs/market-lifecycle-diagrams] commit 4/10: extend lib layer – 1776638559281441112
