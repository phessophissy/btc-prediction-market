import {
  StacksMainnet,
  StacksTestnet,
} from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  broadcastTransaction,
  callReadOnlyFunction,
  cvToJSON,
  falseCV,
  makeContractCall,
  standardPrincipalCV,
  stringUtf8CV,
  trueCV,
  uintCV,
} from '@stacks/transactions';
import { Market, UserPosition, Outcome, MarketStats } from './types';

type ContractArg = {
  type: 'uint' | 'bool' | 'string-utf8' | 'principal';
  value: string | boolean;
};

export class MarketContractService {
  private contractAddress: string;
  private contractName: string;
  private network: StacksTestnet | StacksMainnet;

  constructor(
    contractAddress: string,
    isMainnet: boolean = false,
    contractName: string = 'btc-prediction-market'
  ) {
    this.contractAddress = contractAddress;
    this.contractName = contractName;
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
    const functionArgs: ContractArg[] = [
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
    const functionArgs: ContractArg[] = [
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
    const functionArgs: ContractArg[] = [
      { type: 'uint', value: marketId.toString() },
      { type: 'uint', value: (amount * 1000000).toString() }, // Convert to microSTX
    ];

    return this.callContract(functionName, functionArgs, senderKey);
  }

  /**
   * Settle a market after the settlement height
   */
  async settleMarket(marketId: number, senderKey: string): Promise<string> {
    const functionArgs: ContractArg[] = [
      { type: 'uint', value: marketId.toString() },
    ];

    return this.callContract('settle-market', functionArgs, senderKey);
  }

  /**
   * Claim winnings from a settled market
   */
  async claimWinnings(marketId: number, senderKey: string): Promise<string> {
    const functionArgs: ContractArg[] = [
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
    ] as ContractArg[]);
    if (!response || response.type === 'none') {
      return null;
    }
    return response.value || null;
  }

  /**
   * Get total market count
   */
  async getMarketCount(): Promise<number> {
    const response = await this.readContract('get-market-count', []);
    return Number(response?.value || 0);
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
    ] as ContractArg[]);
    if (!response || response.type === 'none') {
      return null;
    }
    return response.value || null;
  }

  /**
   * Get market odds
   */
  async getMarketOdds(marketId: number): Promise<any | null> {
    const response = await this.readContract('get-market-odds', [
      { type: 'uint', value: marketId.toString() },
    ] as ContractArg[]);
    if (!response || response.type === 'none') {
      return null;
    }
    return response.value || null;
  }

  async getCurrentBurnHeight(): Promise<number> {
    const response = await this.readContract('get-current-burn-height', []);
    return Number(response?.value || 0);
  }

  /**
   * Internal method to read contract data (read-only)
   */
  private async readContract(
    functionName: string,
    functionArgs: ContractArg[]
  ): Promise<any> {
    const result = await callReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName,
      functionArgs: functionArgs.map(arg => this.toClarityValue(arg)),
      network: this.network,
      senderAddress: this.contractAddress,
    });

    return cvToJSON(result);
  }

  /**
   * Internal method to call contract functions
   */
  private async callContract(
    functionName: string,
    functionArgs: ContractArg[],
    senderKey: string
  ): Promise<string> {
    const txOptions = {
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName,
      functionArgs: functionArgs.map(arg => this.toClarityValue(arg)),
      senderKey,
      network: this.network,
      postConditionMode: PostConditionMode.Allow,
      anchorMode: AnchorMode.Any,
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

  private toClarityValue(arg: ContractArg) {
    switch (arg.type) {
      case 'uint':
        return uintCV(arg.value as string);
      case 'bool':
        return arg.value ? trueCV() : falseCV();
      case 'string-utf8':
        return stringUtf8CV(arg.value as string);
      case 'principal':
        return standardPrincipalCV(arg.value as string);
    }
  }
}

export default MarketContractService;
