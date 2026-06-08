// src/providers/sui.ts — Blockberry API
import { TransactionItem } from '../types';
import { toLiteral } from '../utils';

interface BalanceChange {
  owner: { addressOwner?: string };
  amount: string;
  coinType: string;
}

interface TransactionDto {
  txHash: string;
  senderAddress: string;
  recipients: string[];
  txStatus: 'SUCCESS' | 'FAILURE' | 'ABORT';
  fee: number;
  timestamp: number;
  checkpoint: number;
  balanceChanges: BalanceChange[];
}

interface NodeSliceResponse {
  content: TransactionDto[];
  nextCursor?: string;
  hasNextPage: boolean;
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
    headers['x-api-key'] = apiKey;
  }

  const pageSize = Math.min(skip + limit, 50);

  // Fetch both sent and received transactions in parallel
  const [senderRes, receiverRes] = await Promise.all([
    fetch(`${baseUrl}/v1/accounts/${encodeURIComponent(address)}/transactions?transactionsParticipationType=SENDER&size=${pageSize}&orderBy=DESC`, {
      headers, signal: AbortSignal.timeout(10_000),
    }),
    fetch(`${baseUrl}/v1/accounts/${encodeURIComponent(address)}/transactions?transactionsParticipationType=RECEIVER&size=${pageSize}&orderBy=DESC`, {
      headers, signal: AbortSignal.timeout(10_000),
    }),
  ]);

  if (!senderRes.ok) {
    throw new Error(`Blockberry API error: ${senderRes.status} ${senderRes.statusText || 'Unknown'}`);
  }
  if (!receiverRes.ok) {
    throw new Error(`Blockberry API error: ${receiverRes.status} ${receiverRes.statusText || 'Unknown'}`);
  }

  const senderData = await senderRes.json() as NodeSliceResponse;
  const receiverData = await receiverRes.json() as NodeSliceResponse;

  const seen = new Set<string>();
  const txs: TransactionItem[] = [];

  function processTx(tx: TransactionDto): void {
    if (seen.has(tx.txHash)) return;
    seen.add(tx.txHash);

    // Find SUI balance change for the queried address
    const suiChange = tx.balanceChanges?.find(
      (bc) => bc.coinType === '0x2::sui::SUI' && bc.owner?.addressOwner === address,
    );

    const value = suiChange?.amount ?? '0';
    const absValue = value.startsWith('-') ? value.slice(1) : value;

    txs.push({
      txHash: tx.txHash,
      type: 'coin',
      from: tx.senderAddress,
      to: tx.recipients?.[0] ?? '',
      value: toLiteral(absValue, 9),
      symbol: 'SUI',
      decimals: 9,
      contractAddress: null,
      timestamp: Math.floor(tx.timestamp / 1000),
      status: tx.txStatus === 'SUCCESS' ? 'success' : 'failed',
      gasFee: tx.fee.toString(),
      methodId: null,
      blockNumber: tx.checkpoint,
      tokenTransfers: [],
    });
  }

  // Process sender txs first, then receiver txs (dedup by txHash)
  for (const tx of senderData.content ?? []) processTx(tx);
  for (const tx of receiverData.content ?? []) processTx(tx);

  // Sort by timestamp descending
  txs.sort((a, b) => b.timestamp - a.timestamp);

  const total = txs.length;
  const sliced = txs.slice(skip, skip + limit);

  return { total, transactions: sliced };
}
