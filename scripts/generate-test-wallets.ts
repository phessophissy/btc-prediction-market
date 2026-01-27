/**
 * Generate 10 Wallet Addresses for BTC Prediction Market (Mainnet)
 * 
 * This script generates 10 unique Stacks MAINNET wallet addresses.
 * Each wallet gets a mnemonic phrase that can be used to import into a wallet.
 * 
 * ⚠️ SECURITY: Store mnemonics securely! These are real mainnet wallets.
 */

import { generateSecretKey, generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MainnetWallet {
  id: number;
  name: string;
  address: string;  // SP... mainnet address
  mnemonic: string;
  privateKey: string;
}

async function generateMainnetWallets(count: number = 10): Promise<MainnetWallet[]> {
  const wallets: MainnetWallet[] = [];
  
  console.log(`\n🔑 Generating ${count} MAINNET wallets for BTC Prediction Market...\n`);
  
  for (let i = 0; i < count; i++) {
    // Generate a new secret key (mnemonic phrase)
    const mnemonic = generateSecretKey(256);
    
    // Generate wallet from mnemonic
    const wallet = await generateWallet({
      secretKey: mnemonic,
      password: ''  // No password for programmatic access
    });
    
    // Get the first account
    const account = wallet.accounts[0];
    
    // Get STX address (MAINNET version - SP prefix)
    const address = getStxAddress(account, 'mainnet');
    
    const mainnetWallet: MainnetWallet = {
      id: i + 1,
      name: `User${i + 1}`,
      address,
      mnemonic,
      privateKey: account.stxPrivateKey
    };
    
    wallets.push(mainnetWallet);
    
    console.log(`✅ Wallet ${i + 1}: ${mainnetWallet.name}`);
    console.log(`   Address: ${address}`);
  }
  
  return wallets;
}

async function main() {
  const wallets = await generateMainnetWallets(10);
  
  // Save to JSON file (SECURE THIS FILE!)
  const outputPath = path.join(__dirname, 'mainnet-wallets.json');
  fs.writeFileSync(outputPath, JSON.stringify(wallets, null, 2));
  console.log(`\n📁 Wallets saved to: ${outputPath}`);
  console.log(`⚠️  SECURE THIS FILE - contains private keys!\n`);
  
  // Create a public summary (addresses only, no keys)
  const summaryPath = path.join(__dirname, 'mainnet-wallets-public.md');
  let summary = `# Mainnet Wallets for BTC Prediction Market\n\n`;
  summary += `Generated: ${new Date().toISOString()}\n`;
  summary += `Network: **Stacks Mainnet**\n\n`;
  summary += `| # | Name | Address |\n`;
  summary += `|---|------|--------|\n`;
  
  wallets.forEach((w: MainnetWallet) => {
    summary += `| ${w.id} | ${w.name} | \`${w.address}\` |\n`;
  });
  
  summary += `\n## Funding Instructions\n\n`;
  summary += `Each wallet needs STX to interact with the prediction market:\n`;
  summary += `- **Market Creation**: 5 STX fee\n`;
  summary += `- **Minimum Bet**: 1 STX\n`;
  summary += `- **Recommended**: 50-100 STX per wallet for testing\n\n`;
  summary += `## Contract Address\n\n`;
  summary += `\`SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09.btc-prediction-market-v2\`\n`;
  
  fs.writeFileSync(summaryPath, summary);
  console.log(`📝 Public summary saved to: ${summaryPath}`);
  
  // Print addresses for quick copy
  console.log(`\n📋 Mainnet Addresses (SP prefix):\n`);
  wallets.forEach((w: MainnetWallet) => {
    console.log(`${w.id}. ${w.address}`);
  });
  
  console.log(`\n⚠️  IMPORTANT SECURITY NOTES:`);
  console.log(`   1. mainnet-wallets.json contains PRIVATE KEYS`);
  console.log(`   2. Add it to .gitignore immediately`);
  console.log(`   3. Never share or commit this file`);
  console.log(`   4. Back up mnemonics securely\n`);
}

main().catch(console.error);
