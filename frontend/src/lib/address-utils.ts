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

/**
 * Returns true if the string looks like a valid Stacks principal.
 */
export function isValidPrincipal(address: string): boolean {
  return /^(SP|ST|SM)[A-Z0-9]{28,41}$/.test(address);
}

/**
 * Truncate a principal for display: 'SP1234…ABCD'.
 */
export function truncatePrincipal(address: string, chars: number = 6): string {
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}
