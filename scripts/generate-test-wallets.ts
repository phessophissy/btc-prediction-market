import pkg from '@stacks/wallet-sdk';
const { generateWallet, generateSecretKey, generateNewAccount, getStxAddress } = pkg;
import type { Wallet } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';

async function generateTestWallets(count: number, outputFile: string) {
    const mnemonic = generateSecretKey();
    console.log('Generated Secret Key (Mnemonic):', mnemonic);

    let wallet = await generateWallet({
        secretKey: mnemonic,
        password: '',
    });

    // generateWallet creates the first account by default
    for (let i = 1; i < count; i++) {
        const result = generateNewAccount(wallet);
        wallet = {
            ...wallet,
            accounts: result.accounts
        };
    }

    const accounts = wallet.accounts.map(account => ({
        address: getStxAddress(account),
        stxPrivateKey: account.stxPrivateKey,
        index: account.index
    }));

    const outputData = {
        mnemonic,
        accounts
    };

    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
    console.log(`Generated ${count} wallets and saved to ${outputFile}`);
}

const count = parseInt(process.argv[2]) || 10;
const output = process.argv[3] || 'wallets.json';

generateTestWallets(count, output).catch(console.error);
