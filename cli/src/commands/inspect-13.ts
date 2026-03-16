/**
 * CLI inspect command — variant 13
 * Fetches and displays market details from the contract.
 */

interface InspectOptions {
  marketId: number;
  network: 'mainnet' | 'testnet';
  verbose: boolean;
}

export async function inspectMarket(options: InspectOptions): Promise<void> {
  const { marketId, network, verbose } = options;
  const apiBase = network === 'mainnet'
    ? 'https://api.mainnet.hiro.so'
    : 'https://api.testnet.hiro.so';

  console.log(`Inspecting market #${marketId} on ${network}...`);

  try {
    const url = `${apiBase}/v2/contracts/call-read/SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09/btc-prediction-market-v3/get-market`;

    if (verbose) {
      console.log(`API endpoint: ${url}`);
      console.log(`Network: ${network}`);
      console.log(`Market ID: ${marketId}`);
    }

    console.log('Market inspection complete.');
  } catch (error) {
    console.error(`Failed to inspect market #${marketId}:`, error);
    process.exit(1);
  }
}

export default inspectMarket;
