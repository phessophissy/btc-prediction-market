import {
  StacksTestnet,
  StacksMainnet,
} from '@stacks/network';
import {
  ContractCallPayload,
  broadcastTransaction,
  makeContractCall,
} from '@stacks/transactions';
import { Market, UserPosition, Outcome, MarketStats } from './types';

export class MarketContractService {
  private contractAddress: string;
  private contractName: string = 'btc-prediction-market';
  private network: StacksTestnet | StacksMainnet;

  constructor(contractAddress: string, isMainnet: boolean = false) {
    this.contractAddress = contractAddress;
    this.network = isMainnet ? new StacksMainnet() : new StacksTestnet();
  }

  /**
   * Create a binary market (Yes/No)
   */
  async createBinaryMarket(
    title: string,
    description: string,
    settlementBurnHeight: number,
    senderKey: string
  ): Promise<string> {
    const functionArgs = [
      { type: 'string-utf8', value: title },
      { type: 'string-utf8', value: description },
      { type: 'uint', value: settlementBurnHeight.toString() },
    ];

    return this.callContract(
      'create-binary-market',
      functionArgs,
      senderKey
    );
  }

  /**
   * Create a multi-outcome market
   */
  async createMultiMarket(
    title: string,
    description: string,
    settlementBurnHeight: number,
    enableOutcomeA: boolean,
    enableOutcomeB: boolean,
    enableOutcomeC: boolean,
    enableOutcomeD: boolean,
    senderKey: string
  ): Promise<string> {
    const functionArgs = [
      { type: 'string-utf8', value: title },
      { type: 'string-utf8', value: description },
      { type: 'uint', value: settlementBurnHeight.toString() },
      { type: 'bool', value: enableOutcomeA },
      { type: 'bool', value: enableOutcomeB },
      { type: 'bool', value: enableOutcomeC },
      { type: 'bool', value: enableOutcomeD },
    ];

    return this.callContract(
      'create-multi-market',
      functionArgs,
      senderKey
    );
  }

  /**
   * Place a bet on an outcome
   */
  async placeBet(
    marketId: number,
    outcome: 'a' | 'b' | 'c' | 'd',
    amount: number,
    senderKey: string
  ): Promise<string> {
    const functionName = `bet-outcome-${outcome}`;
    const functionArgs = [
      { type: 'uint', value: marketId.toString() },
      { type: 'uint', value: (amount * 1000000).toString() }, // Convert to microSTX
    ];

    return this.callContract(functionName, functionArgs, senderKey);
  }

  /**
   * Settle a market after the settlement height
   */
  async settleMarket(marketId: number, senderKey: string): Promise<string> {
    const functionArgs = [
      { type: 'uint', value: marketId.toString() },
    ];

    return this.callContract('settle-market', functionArgs, senderKey);
  }

  /**
   * Claim winnings from a settled market
   */
  async claimWinnings(marketId: number, senderKey: string): Promise<string> {
    const functionArgs = [
      { type: 'uint', value: marketId.toString() },
    ];

    return this.callContract('claim-winnings', functionArgs, senderKey);
  }

  /**
   * Get market details
   */
  async getMarket(marketId: number): Promise<Market | null> {
    const response = await this.readContract('get-market', [
      { type: 'uint', value: marketId.toString() },
    ]);
    return response || null;
  }

  /**
   * Get total market count
   */
  async getMarketCount(): Promise<number> {
    const response = await this.readContract('get-market-count', []);
    return Number(response || 0);
  }

  /**
   * Get user position in a market
   */
  async getUserPosition(
    marketId: number,
    userAddress: string
  ): Promise<UserPosition | null> {
    const response = await this.readContract('get-user-position', [
      { type: 'uint', value: marketId.toString() },
      { type: 'principal', value: userAddress },
    ]);
    return response || null;
  }

  /**
   * Get market odds
   */
  async getMarketOdds(marketId: number): Promise<any | null> {
    const response = await this.readContract('get-market-odds', [
      { type: 'uint', value: marketId.toString() },
    ]);
    return response || null;
  }

  /**
   * Internal method to read contract data (read-only)
   */
  private async readContract(
    functionName: string,
    functionArgs: any[]
  ): Promise<any> {
    // In a real environment, this would call a Stacks node's read-only function endpoint
    // For this example, we'll log it. In a real SDK, you'd use @stacks/transactions 'callReadOnlyFunction'
    console.log(`Reading ${functionName} with args:`, functionArgs);

    // Placeholder for actual read logic
    // const result = await callReadOnlyFunction({...});
    // return cvToValue(result.value);
    return null;
  }

  /**
   * Internal method to call contract functions
   */
  private async callContract(
    functionName: string,
    functionArgs: any[],
    senderKey: string
  ): Promise<string> {
    const txOptions = {
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName,
      functionArgs: functionArgs.map(arg => {
        if (arg.type === 'uint') {
          return { type: arg.type, value: BigInt(arg.value) };
        }
        if (arg.type === 'bool') {
          return { type: arg.type, value: arg.value };
        }
        if (arg.type === 'string-utf8') {
          return { type: arg.type, value: arg.value };
        }
        return arg;
      }),
      senderKey,
      network: this.network,
      postConditionMode: 0x01, // Allow
      anchorMode: 1, // Any
    };

    try {
      const transaction = await makeContractCall(txOptions as any);
      const result = await broadcastTransaction(transaction, this.network);

      if ('error' in result) {
        throw new Error(`Transaction failed: ${result.error}`);
      }

      return result.txid;
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }
  }
}

export default MarketContractService;
