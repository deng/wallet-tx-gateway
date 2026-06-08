// src/providers/aptos.ts
import { TransactionItem } from '../types';
import { toLiteral } from '../utils';

interface AptosTx {
  version: string;
  hash: string;
  sender: string;
  success: boolean;
  timestamp: string;
  gas_used: string;
  gas_unit_price: string;
  payload?: { type: string; function?: string };
  events?: Array<{
    type: string;
    data?: { amount?: string };
    guid?: { account_address?: string };
  }>;
}

export async function fetchTransactions(
  address: string,
  skip: number,
  limit: number,
  _apiKey: string | undefined,
  baseUrl: string,
): Promise<{ total: number; transactions: TransactionItem[] }> {
  // Aptos API is public, no key needed.
  // Fetch transactions where address is sender, then combine with receiver lookups
  const limitParam = skip + limit;

  const res = await fetch(
    `${baseUrl}/accounts/${encodeURIComponent(address)}/transactions?limit=${limitParam}`,
    { signal: AbortSignal.timeout(10_000) },
  );

  if (!res.ok) {
    throw new Error(`Aptos API error: ${res.status} ${res.statusText || 'Unknown'}`);
  }

  const txs = await res.json() as AptosTx[];
  const items: TransactionItem[] = [];

  for (const tx of txs) {
    // Extract value from events
    const depositEvent = tx.events?.find((e) => e.type.includes('DepositEvent') || e.type.includes('deposit'));
    const value = depositEvent?.data?.amount ?? '0';

    items.push({
      txHash: tx.hash,
      type: 'coin',
      from: tx.sender,
      to: '',
      value: toLiteral(value, 8),
      symbol: 'APT',
      decimals: 8,
      contractAddress: null,
      timestamp: Math.floor(parseInt(tx.timestamp, 10) / 1000000), // microseconds to seconds
      status: tx.success ? 'success' : 'failed',
      gasFee: (BigInt(tx.gas_used || '0') * BigInt(tx.gas_unit_price || '0')).toString(),
      methodId: tx.payload?.function ?? null,
      blockNumber: parseInt(tx.version, 10),
      tokenTransfers: [],
    });
  }

  // Sort by timestamp descending
  items.sort((a, b) => b.timestamp - a.timestamp);

  const total = items.length;
  const sliced = items.slice(skip, skip + limit);

  return { total, transactions: sliced };
}
