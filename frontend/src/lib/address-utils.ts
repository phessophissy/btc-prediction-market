export function truncateAddress(address: string, prefixLen = 5, suffixLen = 4): string {
  if (!address || address.length <= prefixLen + suffixLen + 3) return address || '';
  return `${address.slice(0, prefixLen)}...${address.slice(-suffixLen)}`;
}

export function isValidStxAddress(address: string): boolean {
  if (!address) return false;
  return /^S[PM][A-Z0-9]{38,40}$/.test(address);
}

export function getAddressNetwork(address: string): 'mainnet' | 'testnet' | 'unknown' {
  if (address.startsWith('SP')) return 'mainnet';
  if (address.startsWith('ST')) return 'testnet';
  return 'unknown';
}
