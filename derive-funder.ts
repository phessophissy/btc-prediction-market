import { getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';

const senderKey = '879418bd7dd752fd99b85a1614ca9371b0982bd0a49c6223639ca45d7f4d2850';

// The key needs to be prefixed with '01' for mainnet
const fullKey = senderKey + '01';

const senderAddress = getAddressFromPrivateKey(fullKey, TransactionVersion.Mainnet);

console.log('SENDER_KEY from .env:');
console.log(senderKey);
console.log('');
console.log('Derived Funder Wallet Address:');
console.log(senderAddress);
