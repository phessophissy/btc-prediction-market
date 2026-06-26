import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';

const wallets = JSON.parse(fs.readFileSync('./wallets.json', 'utf8'));
const mnemonic = wallets.mnemonic;

(async () => {
  const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
  const masterAccount = wallet.accounts[0];
  const masterAddress = getStxAddress(masterAccount, 'mainnet');
  
  console.log('Mnemonic:');
  console.log(mnemonic);
  console.log('');
  console.log('Master Wallet Address:', masterAddress);
  console.log('Master Private Key:', masterAccount.stxPrivateKey);
})();
