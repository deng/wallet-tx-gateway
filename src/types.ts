// ---------------------------------------------------------------------------
// Transaction item types
// ---------------------------------------------------------------------------
export interface TokenTransfer {
  contractAddress: string | null;
  symbol: string;
  from: string;
  to: string;
  value: string;
  decimals: number | null;
}

export interface TransactionItem {
  txHash: string;
  type: 'coin' | 'token';
  from: string;
  to: string;
  value: string;
  symbol: string;
  decimals: number | null;
  contractAddress: string | null;
  timestamp: number;
  status: 'success' | 'failed' | 'pending';
  gasFee: string;
  methodId: string | null;
  blockNumber: number | null;
  tokenTransfers: TokenTransfer[];
}

export interface TransactionsResult {
  total: number;
  transactions: TransactionItem[];
}

// ---------------------------------------------------------------------------
// Provider interface
// ---------------------------------------------------------------------------
export interface TransactionProvider {
  fetchTransactions(
    address: string,
    skip: number,
    limit: number,
    apiKey?: string,
  ): Promise<TransactionsResult>;
}

// ---------------------------------------------------------------------------
// API response types
// ---------------------------------------------------------------------------
export interface TxResponseData {
  address: string;
  chain: string;
  transactions: TransactionItem[];
}

export interface TxResponse {
  success: boolean;
  data?: TxResponseData;
  error?: string;
}

export interface ChainsResponse {
  success: boolean;
  data: Array<{ chain: string; name: string; nativeCurrency: string }>;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

// ---------------------------------------------------------------------------
// Environment variables
// ---------------------------------------------------------------------------
export interface Env {
  ETHERSCAN_API_KEY?: string;
  TRONGRID_API_KEY?: string;
  SOLSCAN_API_KEY?: string;
  SUISCAN_API_KEY?: string;
  TX_CACHE_TTL?: string;
}
