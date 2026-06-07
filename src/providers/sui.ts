// src/providers/sui.ts
import { TransactionItem } from '../types';

interface SuiBalanceChange {
  owner: Record<string, string>;
  coinType: string;
  amount: string;
}

interface SuiTx {
  transactionDigest: string;
  timestampMs: string;
  sender: string;
  effects: {
    status: { status: string };
  };
  balanceChanges: SuiBalanceChange[];
  gasFee?: { gasUsed: number; gasPrice: number };
}

interface SuiResponse {
  data: SuiTx[];
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
    headers['X-API-KEY'] = apiKey;
  }

  const limitParam = skip + limit;

  const res = await fetch(
    `${baseUrl}/v1/account/${encodeURIComponent(address)}/transactions?limit=${limitParam}`,
    { headers, signal: AbortSignal.timeout(10_000) },
  );

  if (!res.ok) {
    throw new Error(`Suiscan API error: ${res.status} ${res.statusText || 'Unknown'}`);
  }

  const data = await res.json() as SuiResponse;
  const txs: TransactionItem[] = [];

  for (const tx of data.data ?? []) {
    // Find SUI coin balance change for this address
    const suiChange = tx.balanceChanges?.find(
      (bc) => bc.coinType === '0x2::sui::SUI' &&
        Object.values(bc.owner)[0] === address,
    );

    const value = suiChange?.amount ?? '0';
    // Remove negative sign for display (negative = sent)
    const absValue = value.startsWith('-') ? value.slice(1) : value;
    const gasFee = (BigInt(tx.gasFee?.gasUsed ?? 0) * BigInt(tx.gasFee?.gasPrice ?? 0)).toString();

    txs.push({
      txHash: tx.transactionDigest,
      type: 'coin',
      from: tx.sender,
      to: '',
      value: absValue,
      symbol: 'SUI',
      decimals: 9,
      contractAddress: null,
      timestamp: Math.floor(parseInt(tx.timestampMs, 10) / 1000),
      status: tx.effects?.status?.status === 'success' ? 'success' : 'failed',
      gasFee,
      methodId: null,
      blockNumber: null,
      tokenTransfers: [],
    });
  }

  txs.sort((a, b) => b.timestamp - a.timestamp);

  const total = txs.length;
  const sliced = txs.slice(skip, skip + limit);

  return { total, transactions: sliced };
}
