#!/usr/bin/env node
/**
 * Simple Test Wallet Generator for Clarinet Devnet
 * 
 * Generates 10 test wallet configurations that can be added to Devnet.toml
 * These use deterministic mnemonics for reproducible testing.
 * 
 * Run: node scripts/generate-devnet-wallets.js
 */

// Pre-generated test mnemonics (24 words each) - TESTNET ONLY
const TEST_MNEMONICS = [
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art",
  "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote",
  "legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth title",
  "letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic bless",
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
  "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
  "jelly better achieve collect unaware mountain thought cargo oxygen act hood bridge",
  "renew stay biology evidence goat welcome casual join adapt armor shuffle fault little machine walk stumble urge swap",
  "dignity pass list indicate nasty swamp pool script soccer toe leaf photo multiply desk host tomato cradle drill spread actor shine dismiss champion exotic",
  "turtle front uncle idea crush write shrug there lottery flower risk shell"
];

// Clarinet default devnet wallets (STX addresses)
const DEVNET_ADDRESSES = [
  { name: "deployer", address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM" },
  { name: "wallet_1", address: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5" },
  { name: "wallet_2", address: "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG" },
  { name: "wallet_3", address: "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC" },
  { name: "wallet_4", address: "ST2NEB84ASEZ1T45N3WVYH9Y41Z8K64QFSMVNV5D1" },
  { name: "wallet_5", address: "ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB" },
  { name: "wallet_6", address: "ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0" },
  { name: "wallet_7", address: "ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ" },
  { name: "wallet_8", address: "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP" },
  { name: "wallet_9", address: "STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6" },
  { name: "wallet_10", address: "ST2VCQJHQFJS30TRZPGYPQ49WYQZXP0XGCA6RG8Y3" }
];

console.log(`
╔════════════════════════════════════════════════════════════════╗
║     BTC PREDICTION MARKET - TEST WALLETS (DEVNET)              ║
╚════════════════════════════════════════════════════════════════╝

These are the default Clarinet devnet wallet addresses.
They are pre-funded in the simnet/devnet environment.

`);

console.log("┌────────────┬──────────────────────────────────────────────────┐");
console.log("│   Name     │                    Address                       │");
console.log("├────────────┼──────────────────────────────────────────────────┤");

DEVNET_ADDRESSES.forEach(wallet => {
  const paddedName = wallet.name.padEnd(10);
  console.log(`│ ${paddedName} │ ${wallet.address} │`);
});

console.log("└────────────┴──────────────────────────────────────────────────┘");

console.log(`
📝 USAGE IN TESTS:

  // Import addresses
  const WALLETS = {
    deployer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    user1: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    user2: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    // ... etc
  };

  // Place bet
  simnet.callPublicFn(
    'btc-prediction-market',
    'bet-outcome-a',
    [Cl.uint(0), Cl.uint(10_000_000n)],
    WALLETS.user1
  );

📁 Test file location: tests/interaction.test.ts

🚀 Run tests:
  npm run clarinet:test
  or
  clarinet test

⚠️  These wallets are for DEVNET/SIMNET testing only!
    Never use on mainnet.
`);

// Output JSON for programmatic use
const outputJson = {
  network: "devnet",
  generated: new Date().toISOString(),
  wallets: DEVNET_ADDRESSES.map((w, i) => ({
    ...w,
    balance: "100000000000", // 100,000 STX
    role: i === 0 ? "deployer" : `tester_${i}`
  }))
};

const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'test-wallets.json');
fs.writeFileSync(outputPath, JSON.stringify(outputJson, null, 2));
console.log(`\n✅ Wallet data saved to: ${outputPath}\n`);
