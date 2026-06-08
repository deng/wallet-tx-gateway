// src/providers/solana.ts
import { TransactionItem } from '../types';
import { toLiteral } from '../utils';

interface SolscanTransfer {
  txHash: string;
  blockTime: number;
  fromAddress: string;
  toAddress: string;
  amount: number;
  status: string;
  fee: number;
}

interface SolscanTokenTransfer extends SolscanTransfer {
  tokenAddress: string;
  tokenSymbol: string;
  decimals: number;
}

interface SolscanResponse<T> {
  success: boolean;
  data: T[];
  total?: number;
}

export async function fetchTransactions(
  address: string,
  skip: number,
  limit: number,
  apiKey: string | undefined,
  baseUrl: string,
): Promise<{ total: number; transactions: TransactionItem[] }> {
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['token'] = apiKey;
  }

  const pageSize = skip + limit;
  const page = Math.floor(skip / Math.max(limit, 1)) + 1;

  const [solRes, splRes] = await Promise.all([
    fetch(`${baseUrl}/api/v1/account/transfer?address=${encodeURIComponent(address)}&page=${page}&page_size=${pageSize}`, { headers, signal: AbortSignal.timeout(10_000) }),
    fetch(`${baseUrl}/api/v1/account/token?address=${encodeURIComponent(address)}&page=${page}&page_size=${pageSize}`, { headers, signal: AbortSignal.timeout(10_000) }),
  ]);

  if (!solRes.ok) {
    throw new Error(`Solscan API error: ${solRes.status} ${solRes.statusText || 'Unknown'}`);
  }
  if (!splRes.ok) {
    throw new Error(`Solscan API error: ${splRes.status} ${splRes.statusText || 'Unknown'}`);
  }

  const solData = await solRes.json() as SolscanResponse<SolscanTransfer>;
  const splData = await splRes.json() as SolscanResponse<SolscanTokenTransfer>;

  const txs: TransactionItem[] = [];

  for (const item of solData.data ?? []) {
    txs.push({
      txHash: item.txHash,
      type: 'coin',
      from: item.fromAddress,
      to: item.toAddress,
      value: toLiteral(item.amount.toString(), 9),
      symbol: 'SOL',
      decimals: 9,
      contractAddress: null,
      timestamp: item.blockTime,
      status: item.status === 'success' ? 'success' : 'failed',
      gasFee: item.fee.toString(),
      methodId: null,
      blockNumber: null,
      tokenTransfers: [],
    });
  }

  for (const item of splData.data ?? []) {
    const splValue = toLiteral(item.amount.toString(), item.decimals);
    txs.push({
      txHash: item.txHash,
      type: 'token',
      from: item.fromAddress,
      to: item.toAddress,
      value: splValue,
      symbol: item.tokenSymbol,
      decimals: item.decimals,
      contractAddress: item.tokenAddress,
      timestamp: item.blockTime,
      status: item.status === 'success' ? 'success' : 'failed',
      gasFee: item.fee.toString(),
      methodId: null,
      blockNumber: null,
      tokenTransfers: [{
        contractAddress: item.tokenAddress,
        symbol: item.tokenSymbol,
        from: item.fromAddress,
        to: item.toAddress,
        value: splValue,
        decimals: item.decimals,
      }],
    });
  }

  txs.sort((a, b) => b.timestamp - a.timestamp);

  const total = txs.length;
  const sliced = txs.slice(skip, skip + limit);

  return { total, transactions: sliced };
}
