import { StacksMainnet, StacksTestnet } from '@stacks/network';
import {
  AnchorMode,
  FungibleConditionCode,
  PostConditionMode,
  TransactionVersion,
  broadcastTransaction,
  callReadOnlyFunction,
  cvToJSON,
  falseCV,
  getAddressFromPrivateKey,
  makeContractCall,
  makeStandardSTXPostCondition,
  standardPrincipalCV,
  stringUtf8CV,
  trueCV,
  uintCV,
} from '@stacks/transactions';
import { validateDescription, validateSettlementHeight, validateTitle } from './utils/validation-50';
import { Market, UserPosition } from './types';

type ContractArg = {
  type: 'uint' | 'bool' | 'string-utf8' | 'principal';
  value: string | boolean;
};

type ClarityJsonValue = {
  type?: string;
  value?: unknown;
} | null | undefined;

type TupleValue = Record<string, unknown>;

type ContractCallOptions = {
  postConditionMode?: PostConditionMode;
  postConditions?: unknown[];
};

const MARKET_CREATION_FEE_MICROSTX = 100_000n;

function unwrapClarityValue(value: unknown): unknown {
  if (
    value &&
    typeof value === 'object' &&
    'value' in (value as Record<string, unknown>)
  ) {
    return unwrapClarityValue((value as Record<string, unknown>).value);
  }

  return value;
}

function parseNumber(value: unknown, fallback = 0): number {
  const unwrapped = unwrapClarityValue(value);

  if (typeof unwrapped === 'number' && Number.isFinite(unwrapped)) {
    return unwrapped;
  }

  if (typeof unwrapped === 'bigint') {
    return Number(unwrapped);
  }

  if (typeof unwrapped === 'string') {
    const parsed = Number.parseInt(unwrapped, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function parseOptionalNumber(value: unknown): number | null {
  const unwrapped = unwrapClarityValue(value);
  if (unwrapped === null || unwrapped === undefined) {
    return null;
  }

  return parseNumber(unwrapped);
}

function parseString(value: unknown, fallback = ''): string {
  const unwrapped = unwrapClarityValue(value);
  return typeof unwrapped === 'string' ? unwrapped : fallback;
}

function parseOptionalString(value: unknown): string | null {
  const unwrapped = unwrapClarityValue(value);
  return typeof unwrapped === 'string' ? unwrapped : null;
}

function parseBoolean(value: unknown, fallback = false): boolean {
  const unwrapped = unwrapClarityValue(value);
  if (typeof unwrapped === 'boolean') {
    return unwrapped;
  }

  if (typeof unwrapped === 'string') {
    if (unwrapped === 'true') {
      return true;
    }
    if (unwrapped === 'false') {
      return false;
    }
  }

  return fallback;
}

function extractOptionalTuple(response: ClarityJsonValue): TupleValue | null {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const outerValue = (response as Record<string, unknown>).value;
  if (outerValue === null || outerValue === undefined) {
    return null;
  }

  if (
    outerValue &&
    typeof outerValue === 'object' &&
    'value' in (outerValue as Record<string, unknown>)
  ) {
    const nestedValue = (outerValue as Record<string, unknown>).value;
    if (nestedValue && typeof nestedValue === 'object') {
      return nestedValue as TupleValue;
    }
  }

  if (typeof outerValue === 'object') {
    return outerValue as TupleValue;
  }

  return null;
}

export function decodeMarketResponse(marketId: number, response: ClarityJsonValue): Market | null {
  const value = extractOptionalTuple(response);
  if (!value) {
    return null;
  }

  return {
    id: marketId,
    creator: parseString(value.creator),
    title: parseString(value.title),
    description: parseString(value.description),
    settlementBurnHeight: parseNumber(value['settlement-burn-height']),
    settlementType: parseString(value['settlement-type']),
    possibleOutcomes: parseNumber(value['possible-outcomes']),
    totalPool: parseNumber(value['total-pool']),
    outcomeAPool: parseNumber(value['outcome-a-pool']),
    outcomeBPool: parseNumber(value['outcome-b-pool']),
    outcomeCPool: parseNumber(value['outcome-c-pool']),
    outcomeDPool: parseNumber(value['outcome-d-pool']),
    winningOutcome: parseOptionalNumber(value['winning-outcome']) as Market['winningOutcome'],
    settled: parseBoolean(value.settled),
    settledAtBurnHeight: parseOptionalNumber(value['settled-at-burn-height']),
    settlementBlockHash: parseOptionalString(value['settlement-block-hash']),
    createdAtBurnHeight: parseNumber(value['created-at-burn-height']),
    createdAtStacksHeight: parseNumber(value['created-at-stacks-height']),
  };
}

export function decodeUserPositionResponse(
  marketId: number,
  userAddress: string,
  response: ClarityJsonValue
): UserPosition | null {
  const value = extractOptionalTuple(response);
  if (!value) {
    return null;
  }

  return {
    marketId,
    userAddress,
    outcomeAAmount: parseNumber(value['outcome-a-amount']),
    outcomeBAmount: parseNumber(value['outcome-b-amount']),
    outcomeCAmount: parseNumber(value['outcome-c-amount']),
    outcomeDAmount: parseNumber(value['outcome-d-amount']),
    totalInvested: parseNumber(value['total-invested']),
    claimed: parseBoolean(value.claimed),
  };
}

export class MarketContractService {
  private readonly contractAddress: string;
  private readonly contractName: string;
  private readonly network: StacksTestnet | StacksMainnet;
  private readonly transactionVersion: TransactionVersion;

  constructor(
    contractAddress: string,
    isMainnet = false,
    contractName = 'btc-prediction-market-v3'
  ) {
    this.contractAddress = contractAddress;
    this.contractName = contractName;
    this.network = isMainnet ? new StacksMainnet() : new StacksTestnet();
    this.transactionVersion = isMainnet
      ? TransactionVersion.Mainnet
      : TransactionVersion.Testnet;
  }

  async createBinaryMarket(
    title: string,
    description: string,
    settlementBurnHeight: number,
    senderKey: string
  ): Promise<string> {
    const titleValidation = validateTitle(title);
    if (!titleValidation.valid) {
      throw new Error(titleValidation.error);
    }

    const descriptionValidation = validateDescription(description);
    if (!descriptionValidation.valid) {
      throw new Error(descriptionValidation.error);
    }

    const currentBurnHeight = await this.getCurrentBurnHeight();
    const settlementValidation = validateSettlementHeight(
      currentBurnHeight,
      settlementBurnHeight
    );
    if (!settlementValidation.valid) {
      throw new Error(settlementValidation.error);
    }

    const senderAddress = getAddressFromPrivateKey(
      senderKey,
      this.transactionVersion
    );

    return this.callContract(
      'create-binary-market',
      [
        { type: 'string-utf8', value: title },
        { type: 'string-utf8', value: description },
        { type: 'uint', value: settlementBurnHeight.toString() },
      ],
      senderKey,
      {
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardSTXPostCondition(
            senderAddress,
            FungibleConditionCode.Equal,
            MARKET_CREATION_FEE_MICROSTX
          ),
        ],
      }
    );
  }

  async getMarket(marketId: number): Promise<Market | null> {
    const response = await this.readContract('get-market', [
      { type: 'uint', value: marketId.toString() },
    ]);

    return decodeMarketResponse(marketId, response);
  }

  async getMarketCount(): Promise<number> {
    const response = await this.readContract('get-market-count', []);
    return parseNumber(response);
  }

  async getUserPosition(
    marketId: number,
    userAddress: string
  ): Promise<UserPosition | null> {
    const response = await this.readContract('get-user-position', [
      { type: 'uint', value: marketId.toString() },
      { type: 'principal', value: userAddress },
    ]);

    return decodeUserPositionResponse(marketId, userAddress, response);
  }

  async getCurrentBurnHeight(): Promise<number> {
    const response = await this.readContract('get-current-burn-height', []);
    return parseNumber(response);
  }

  async getOwner(): Promise<string> {
    const response = await this.readContract('get-owner', []);
    return parseString(response);
  }

  async getPendingOwner(): Promise<string | null> {
    const response = await this.readContract('get-pending-owner', []);
    return parseOptionalString(response);
  }

  async getContractBalance(): Promise<number> {
    const response = await this.readContract('get-contract-balance', []);
    return parseNumber(response);
  }

  async getTotalFeesCollected(): Promise<number> {
    const response = await this.readContract('get-total-fees-collected', []);
    return parseNumber(response);
  }

  async isPaused(): Promise<boolean> {
    const response = await this.readContract('is-paused', []);
    return parseBoolean(response);
  }

  async isEmergency(): Promise<boolean> {
    const response = await this.readContract('is-emergency', []);
    return parseBoolean(response);
  }

  async transferOwnership(newOwner: string, senderKey: string): Promise<string> {
    return this.callContract(
      'transfer-ownership',
      [{ type: 'principal', value: newOwner }],
      senderKey
    );
  }

  async acceptOwnership(senderKey: string): Promise<string> {
    return this.callContract('accept-ownership', [], senderKey);
  }

  async cancelOwnershipTransfer(senderKey: string): Promise<string> {
    return this.callContract('cancel-ownership-transfer', [], senderKey);
  }

  async enableEmergencyMode(senderKey: string): Promise<string> {
    return this.callContract('enable-emergency-mode', [], senderKey);
  }

  async withdrawFees(
    amountMicroStx: number,
    recipient: string,
    senderKey: string
  ): Promise<string> {
    return this.callContract(
      'withdraw-fees',
      [
        { type: 'uint', value: amountMicroStx.toString() },
        { type: 'principal', value: recipient },
      ],
      senderKey
    );
  }

  async emergencyWithdrawAll(senderKey: string): Promise<string> {
    return this.callContract('emergency-withdraw-all', [], senderKey);
  }

  async emergencyWithdraw(
    amountMicroStx: number,
    recipient: string,
    senderKey: string
  ): Promise<string> {
    return this.callContract(
      'emergency-withdraw',
      [
        { type: 'uint', value: amountMicroStx.toString() },
        { type: 'principal', value: recipient },
      ],
      senderKey
    );
  }

  async setPlatformPaused(paused: boolean, senderKey: string): Promise<string> {
    return this.callContract(
      'set-platform-paused',
      [{ type: 'bool', value: paused }],
      senderKey
    );
  }

  private async readContract(
    functionName: string,
    functionArgs: ContractArg[]
  ): Promise<ClarityJsonValue> {
    const result = await callReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName,
      functionArgs: functionArgs.map(arg => this.toClarityValue(arg)),
      network: this.network,
      senderAddress: this.contractAddress,
    });

    return cvToJSON(result) as ClarityJsonValue;
  }

  private async callContract(
    functionName: string,
    functionArgs: ContractArg[],
    senderKey: string,
    options: ContractCallOptions = {}
  ): Promise<string> {
    const txOptions = {
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName,
      functionArgs: functionArgs.map(arg => this.toClarityValue(arg)),
      senderKey,
      network: this.network,
      postConditionMode: options.postConditionMode ?? PostConditionMode.Allow,
      postConditions: options.postConditions ?? [],
      anchorMode: AnchorMode.Any,
    };

    const transaction = await makeContractCall(txOptions as never);
    const result = await broadcastTransaction(transaction, this.network);

    if ('error' in result) {
      throw new Error(`Transaction failed: ${result.error}`);
    }

    return result.txid;
  }

  private toClarityValue(arg: ContractArg) {
    switch (arg.type) {
      case 'uint':
        return uintCV(BigInt(arg.value as string));
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
