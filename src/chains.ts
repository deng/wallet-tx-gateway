// Chain registry: caip-2 → upstream config
// Chain IDs aligned with wallet/lib/src/models/chain_models.dart

export interface ChainInfo {
  caip2: string;
  name: string;
  nativeCurrency: string;
  nativeDecimals: number;
  provider: 'evm' | 'tron' | 'aptos' | 'solana' | 'sui';
  baseUrl: string;
  symbol: string;
  chainId?: string; // for EVM chains (Etherscan V2 requires chainid param)
}

// EVM base URL (Etherscan V2 — single endpoint for all chains)
const ETHERSCAN_V2_BASE = 'https://api.etherscan.io/v2/api';

// TRON base URLs
const TRONGRID_MAINNET_BASE = 'https://api.trongrid.io';
const TRONGRID_SHASTA_BASE = 'https://api.shasta.trongrid.io';
const TRONGRID_NILE_BASE = 'https://nile.trongrid.io';

// APTOS base URLs
const APTOS_MAINNET_BASE = 'https://api.aptoslabs.com/v1';
const APTOS_TESTNET_BASE = 'https://testnet.aptoslabs.com/v1';

// SOLANA base URLs
const SOLSCAN_MAINNET_BASE = 'https://pro-api.solscan.io';
const SOLSCAN_DEVNET_BASE = 'https://pro-api.solscan.io';

// Sui base URLs (Blockberry API)
const SUISCAN_MAINNET_BASE = 'https://api.blockberry.one/sui';
const SUISCAN_TESTNET_BASE = 'https://api.blockberry.one/sui';

const CHAIN_MAP: Record<string, ChainInfo> = {
  // ---- EVM: Ethereum ----
  'eip155:1': {
    caip2: 'eip155:1',
    name: 'Ethereum',
    nativeCurrency: 'ETH',
    nativeDecimals: 18,
    provider: 'evm',
    baseUrl: ETHERSCAN_V2_BASE,
    symbol: 'ETH',
    chainId: '1',
  },
  'eip155:11155111': {
    caip2: 'eip155:11155111',
    name: 'Ethereum Sepolia',
    nativeCurrency: 'ETH',
    nativeDecimals: 18,
    provider: 'evm',
    baseUrl: ETHERSCAN_V2_BASE,
    symbol: 'ETH',
    chainId: '11155111',
  },

  // ---- EVM: BSC ----
  'eip155:56': {
    caip2: 'eip155:56',
    name: 'BNB Smart Chain',
    nativeCurrency: 'BNB',
    nativeDecimals: 18,
    provider: 'evm',
    baseUrl: ETHERSCAN_V2_BASE,
    symbol: 'BNB',
    chainId: '56',
  },
  'eip155:97': {
    caip2: 'eip155:97',
    name: 'BNB Smart Chain Testnet',
    nativeCurrency: 'BNB',
    nativeDecimals: 18,
    provider: 'evm',
    baseUrl: ETHERSCAN_V2_BASE,
    symbol: 'BNB',
    chainId: '97',
  },

  // ---- EVM: Polygon ----
  'eip155:137': {
    caip2: 'eip155:137',
    name: 'Polygon',
    nativeCurrency: 'POL',
    nativeDecimals: 18,
    provider: 'evm',
    baseUrl: ETHERSCAN_V2_BASE,
    symbol: 'POL',
    chainId: '137',
  },
  'eip155:80002': {
    caip2: 'eip155:80002',
    name: 'Polygon Amoy',
    nativeCurrency: 'POL',
    nativeDecimals: 18,
    provider: 'evm',
    baseUrl: ETHERSCAN_V2_BASE,
    symbol: 'POL',
    chainId: '80002',
  },

  // ---- TRON ----
  'tron:0x2b6653dc': {
    caip2: 'tron:0x2b6653dc',
    name: 'TRON',
    nativeCurrency: 'TRX',
    nativeDecimals: 6,
    provider: 'tron',
    baseUrl: TRONGRID_MAINNET_BASE,
    symbol: 'TRX',
  },
  'tron:0x94a9059e': {
    caip2: 'tron:0x94a9059e',
    name: 'TRON Shasta Testnet',
    nativeCurrency: 'TRX',
    nativeDecimals: 6,
    provider: 'tron',
    baseUrl: TRONGRID_SHASTA_BASE,
    symbol: 'TRX',
  },
  'tron:0xcd8690dc': {
    caip2: 'tron:0xcd8690dc',
    name: 'TRON Nile Testnet',
    nativeCurrency: 'TRX',
    nativeDecimals: 6,
    provider: 'tron',
    baseUrl: TRONGRID_NILE_BASE,
    symbol: 'TRX',
  },

  // ---- APTOS ----
  'aptos:1': {
    caip2: 'aptos:1',
    name: 'Aptos',
    nativeCurrency: 'APT',
    nativeDecimals: 8,
    provider: 'aptos',
    baseUrl: APTOS_MAINNET_BASE,
    symbol: 'APT',
  },
  'aptos:2': {
    caip2: 'aptos:2',
    name: 'Aptos Testnet',
    nativeCurrency: 'APT',
    nativeDecimals: 8,
    provider: 'aptos',
    baseUrl: APTOS_TESTNET_BASE,
    symbol: 'APT',
  },

  // ---- SOLANA ----
  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': {
    caip2: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    name: 'Solana',
    nativeCurrency: 'SOL',
    nativeDecimals: 9,
    provider: 'solana',
    baseUrl: SOLSCAN_MAINNET_BASE,
    symbol: 'SOL',
  },
  'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1': {
    caip2: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    name: 'Solana Devnet',
    nativeCurrency: 'SOL',
    nativeDecimals: 9,
    provider: 'solana',
    baseUrl: SOLSCAN_DEVNET_BASE,
    symbol: 'SOL',
  },

  // ---- SUI ----
  'sui:mainnet': {
    caip2: 'sui:mainnet',
    name: 'Sui',
    nativeCurrency: 'SUI',
    nativeDecimals: 9,
    provider: 'sui',
    baseUrl: SUISCAN_MAINNET_BASE,
    symbol: 'SUI',
  },
  'sui:testnet': {
    caip2: 'sui:testnet',
    name: 'Sui Testnet',
    nativeCurrency: 'SUI',
    nativeDecimals: 9,
    provider: 'sui',
    baseUrl: SUISCAN_TESTNET_BASE,
    symbol: 'SUI',
  },
};

export function getChainInfo(caip2: string): ChainInfo | undefined {
  return CHAIN_MAP[caip2];
}

export function getAllChains(): ChainInfo[] {
  return Object.values(CHAIN_MAP);
}
