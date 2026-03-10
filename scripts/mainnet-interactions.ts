import { MarketContractService } from '../sdk/src/MarketContractService';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Default Devnet
    const sdk = new MarketContractService(CONTRACT_ADDRESS, false);

    const walletsPath = path.resolve(__dirname, '../wallets.json');
    if (!fs.existsSync(walletsPath)) {
        console.error('Wallet file not found. Run generate:wallets first.');
        process.exit(1);
    }

    const { accounts } = JSON.parse(fs.readFileSync(walletsPath, 'utf8'));

    console.log(`Starting interaction for ${accounts.length} wallets...`);

    for (const account of accounts) {
        console.log(`\n--- Working with ${account.address} ---`);

        try {
            // Logic: Each wallet places a bet of 1 STX on Outcome A of Market 0
            const txid = await sdk.placeBet(0, 'a', 1, account.stxPrivateKey);
            console.log(`Bet placed by ${account.address}. TX: ${txid}`);

            // Wait slightly between transactions to avoid nonce issues if running sequentially
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
            console.error(`Error betting for ${account.address}:`, error.message);
        }
    }
}

export async function getMarketCount() {
    const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const sdk = new MarketContractService(CONTRACT_ADDRESS, false);
    try {
        const count = await sdk.getMarketCount();
        return count;
    } catch (error) {
        console.error('Error fetching market count:', error);
        return 0;
    }
}

main().catch(console.error);
