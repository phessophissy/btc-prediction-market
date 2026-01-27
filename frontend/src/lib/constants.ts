import { StacksMainnet, StacksTestnet } from "@stacks/network";

// Network configuration - MAINNET DEPLOYED
export const IS_MAINNET = true;
export const NETWORK = new StacksMainnet();

// Contract configuration - NEW DEPLOYER ADDRESS (migrated)
export const CONTRACT_ADDRESS = "SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09";
export const CONTRACT_NAME = "btc-prediction-market";
export const TOKEN_CONTRACT_NAME = "prediction-token";
export const TRAIT_CONTRACT_NAME = "sip-010-trait";

// Old contract (deprecated - DO NOT USE)
export const OLD_CONTRACT_ADDRESS = "SP31G2FZ5JN87BATZMP4ZRYE5F7WZQDNEXJ7G7X97";

// Fee constants (matching contract)
export const MARKET_CREATION_FEE = 5000000; // 5 STX in microSTX
export const PLATFORM_FEE_PERCENT = 300; // 3% in basis points
export const MIN_BET_AMOUNT = 1000000; // 1 STX minimum bet

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
