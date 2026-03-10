import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { StacksMainnet } from '@stacks/network';
import {
    AnchorMode,
    PostConditionMode,
    cvToHex,
    cvToJSON,
    hexToCV,
    makeContractCall,
    stringUtf8CV,
    uintCV,
} from '@stacks/transactions';

const API_BASE = 'https://api.mainnet.hiro.so';
const CONTRACT_ADDRESS =
    process.env.CONTRACT_ADDRESS || 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09';
const CONTRACT_NAME =
    process.env.CONTRACT_NAME || 'btc-prediction-market-v3';
const TITLE_PREFIX = process.env.TITLE_PREFIX || 'BTC Prediction Market';
const DESCRIPTION_PREFIX =
    process.env.DESCRIPTION_PREFIX ||
    'Binary market created by automated project interaction wallet';
const SETTLEMENT_OFFSET = Number(process.env.SETTLEMENT_OFFSET || '20');
const TX_FEE = BigInt(process.env.TX_FEE || '10000');

type WalletAccount = {
    address: string;
    stxPrivateKey: string;
    index: number;
};

function curl(args: string[]): string {
    return execFileSync('curl', ['-sS', '--max-time', '30', ...args], {
        encoding: 'utf8',
    });
}

function postJson(url: string, body: unknown): any {
    return JSON.parse(
        curl([
            '-X',
            'POST',
            '-H',
            'Content-Type: application/json',
            '-d',
            JSON.stringify(body),
            url,
        ])
    );
}

function callReadOnly(functionName: string, args: string[] = []): any {
    const response = postJson(
        `${API_BASE}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${functionName}`,
        {
            sender: CONTRACT_ADDRESS,
            arguments: args,
        }
    );

    if (!response.okay || !response.result) {
        throw new Error(response.cause || `Read-only call failed: ${functionName}`);
    }

    return cvToJSON(hexToCV(response.result));
}

function getCurrentBurnHeight(): number {
    return Number(callReadOnly('get-current-burn-height').value || 0);
}

export async function getMarketCount(): Promise<number> {
    try {
        return Number(callReadOnly('get-market-count').value || 0);
    } catch (error) {
        console.error('Error fetching market count:', error);
        return 0;
    }
}

function getNonce(address: string): bigint {
    const response = JSON.parse(
        curl([`${API_BASE}/extended/v1/address/${address}/nonces`])
    );
    return BigInt(response.possible_next_nonce ?? 0);
}

function broadcastSerializedTx(serialized: Uint8Array): string {
    const tempFile = path.join(
        os.tmpdir(),
        `btc-market-${Date.now()}-${Math.random().toString(36).slice(2)}.bin`
    );

    fs.writeFileSync(tempFile, Buffer.from(serialized));

    try {
        const response = curl([
            '-X',
            'POST',
            '-H',
            'Content-Type: application/octet-stream',
            '--data-binary',
            `@${tempFile}`,
            `${API_BASE}/v2/transactions`,
        ]).trim();

        if (response.startsWith('{')) {
            const parsed = JSON.parse(response);
            throw new Error(parsed.error || parsed.reason || response);
        }

        return response.replace(/"/g, '');
    } finally {
        if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
        }
    }
}

async function createBinaryMarket(
    account: WalletAccount,
    title: string,
    description: string,
    settlementBurnHeight: number
): Promise<string> {
    const network = new StacksMainnet();
    const nonce = getNonce(account.address);
    const transaction = await makeContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-binary-market',
        functionArgs: [
            stringUtf8CV(title),
            stringUtf8CV(description),
            uintCV(settlementBurnHeight),
        ],
        senderKey: account.stxPrivateKey,
        network,
        nonce,
        fee: TX_FEE,
        postConditionMode: PostConditionMode.Allow,
        anchorMode: AnchorMode.Any,
    });

    return broadcastSerializedTx(transaction.serialize());
}

export async function main() {
    const walletsPath = path.resolve(__dirname, '../wallets.json');
    if (!fs.existsSync(walletsPath)) {
        console.error('Wallet file not found. Run generate:wallets first.');
        process.exit(1);
    }

    const { accounts } = JSON.parse(
        fs.readFileSync(walletsPath, 'utf8')
    ) as { accounts: WalletAccount[] };

    const marketCount = await getMarketCount();
    const currentBurnHeight = getCurrentBurnHeight();

    if (!Number.isFinite(currentBurnHeight) || currentBurnHeight <= 0) {
        console.error(
            `Could not determine current burn height for ${CONTRACT_ADDRESS}.${CONTRACT_NAME}.`
        );
        process.exit(1);
    }

    console.log(
        `Starting interaction for ${accounts.length} wallets on ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`
    );
    console.log(
        `Current market count: ${marketCount}. Current burn height: ${currentBurnHeight}.`
    );

    for (const account of accounts) {
        console.log(`\n--- Working with ${account.address} ---`);

        try {
            const marketNumber = marketCount + account.index + 1;
            const settlementBurnHeight =
                currentBurnHeight + SETTLEMENT_OFFSET + account.index;
            const title = `${TITLE_PREFIX} #${marketNumber}`;
            const description = `${DESCRIPTION_PREFIX} #${marketNumber}`;

            console.log(
                `Creating market "${title}" with settlement burn height ${settlementBurnHeight}...`
            );

            const txid = await createBinaryMarket(
                account,
                title,
                description,
                settlementBurnHeight
            );
            console.log(`Market created by ${account.address}. TX: ${txid}`);

            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
            console.error(
                `Error creating market for ${account.address}:`,
                error.message
            );
        }
    }
}

if (require.main === module) {
    main().catch(console.error);
}
