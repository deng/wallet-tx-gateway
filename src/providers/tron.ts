// src/providers/tron.ts
import { TransactionItem } from '../types';

interface TrongridTx {
  txID: string;
  block_timestamp: number;
  from: string;
  to: string;
  value: string;
  receipt?: {
    result?: string;
    energy_fee?: number;
    net_fee?: number;
  };
  raw_data?: { contract?: Array<{ parameter?: { value?: { amount?: number } } }> };
  block_number?: number;
}

interface TrongridTrc20Tx {
  tx_id: string;
  block_timestamp: number;
  from: string;
  to: string;
  value: string;
  token_info: { address: string; symbol: string; decimals: number };
}

interface TrongridResponse<T> {
  data: T[];
  meta?: { total?: number; page_size?: number };
}

interface TronTxEntry {
  tx: TransactionItem;
  rawTs: number;
}

export async function fetchTransactions(
  address: string,
  skip: number,
  limit: number,
  apiKey: string | undefined,
  baseUrl: string,
  contractAddress?: string,
): Promise<{ total: number; transactions: TransactionItem[] }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['TRON-PRO-API-KEY'] = apiKey;
  }

  const pageSize = skip + limit;
  const entries: TronTxEntry[] = [];

  if (contractAddress) {
    const url = `${baseUrl}/v1/accounts/${encodeURIComponent(address)}/transactions/trc20` +
      `?limit=${pageSize}&order_by=block_timestamp,desc` +
      `&contract_address=${encodeURIComponent(contractAddress)}`;
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      throw new Error(`Trongrid API error: ${res.status} ${res.statusText || 'Unknown'}`);
    }
    const data = await res.json() as TrongridResponse<TrongridTrc20Tx>;
    for (const item of data.data) {
      entries.push({
        rawTs: item.block_timestamp,
        tx: {
          txHash: item.tx_id,
          type: 'token',
          from: item.from,
          to: item.to,
          value: item.value,
          symbol: item.token_info.symbol,
          decimals: item.token_info.decimals,
          contractAddress: item.token_info.address,
          timestamp: 0,
          status: 'success',
          gasFee: '0',
          methodId: null,
          blockNumber: null,
          tokenTransfers: [{
            contractAddress: item.token_info.address,
            symbol: item.token_info.symbol,
            from: item.from,
            to: item.to,
            value: item.value,
            decimals: item.token_info.decimals,
          }],
        },
      });
    }
  } else {
    const [nativeRes, trc20Res] = await Promise.all([
      fetch(`${baseUrl}/v1/accounts/${encodeURIComponent(address)}/transactions?limit=${pageSize}&order_by=block_timestamp,desc`, { headers, signal: AbortSignal.timeout(10_000) }),
      fetch(`${baseUrl}/v1/accounts/${encodeURIComponent(address)}/transactions/trc20?limit=${pageSize}&order_by=block_timestamp,desc`, { headers, signal: AbortSignal.timeout(10_000) }),
    ]);

    if (!nativeRes.ok) {
      throw new Error(`Trongrid API error: ${nativeRes.status} ${nativeRes.statusText || 'Unknown'}`);
    }
    if (!trc20Res.ok) {
      throw new Error(`Trongrid API error: ${trc20Res.status} ${trc20Res.statusText || 'Unknown'}`);
    }

    const nativeData = await nativeRes.json() as TrongridResponse<TrongridTx>;
    const trc20Data = await trc20Res.json() as TrongridResponse<TrongridTrc20Tx>;

    for (const item of nativeData.data) {
      const receiptResult = item.receipt?.result;
      // Trongrid receipt.result is undefined for some successful tx types
      const status = !receiptResult || receiptResult === 'SUCCESS' ? 'success' as const : 'failed' as const;
      const amount = item.raw_data?.contract?.[0]?.parameter?.value?.amount?.toString() ?? item.value ?? '0';
      const energyFee = item.receipt?.energy_fee ?? 0;
      const netFee = item.receipt?.net_fee ?? 0;
      const totalFee = energyFee + netFee;

      entries.push({
        rawTs: item.block_timestamp,
        tx: {
          txHash: item.txID,
          type: 'coin',
          from: item.from,
          to: item.to,
          value: amount,
          symbol: 'TRX',
          decimals: 6,
          contractAddress: null,
          timestamp: 0,
          status,
          gasFee: totalFee.toString(),
          methodId: null,
          blockNumber: item.block_number ?? null,
          tokenTransfers: [],
        },
      });
    }

    for (const item of trc20Data.data) {
      entries.push({
        rawTs: item.block_timestamp,
        tx: {
          txHash: item.tx_id,
          type: 'token',
          from: item.from,
          to: item.to,
          value: item.value,
          symbol: item.token_info.symbol,
          decimals: item.token_info.decimals,
          contractAddress: item.token_info.address,
          timestamp: 0,
          status: 'success',
          gasFee: '0',
          methodId: null,
          blockNumber: null,
          tokenTransfers: [{
            contractAddress: item.token_info.address,
            symbol: item.token_info.symbol,
            from: item.from,
            to: item.to,
            value: item.value,
            decimals: item.token_info.decimals,
          }],
        },
      });
    }
  }

  entries.sort((a, b) => b.rawTs - a.rawTs);

  for (const entry of entries) {
    entry.tx.timestamp = Math.floor(entry.rawTs / 1000);
  }

  const total = entries.length;
  const sliced = entries.slice(skip, skip + limit);

  return { total, transactions: sliced.map((e) => e.tx) };
}
