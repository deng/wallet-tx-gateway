// src/providers/tron.ts
import { TransactionItem } from '../types';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

async function hexToBase58(hex: string): Promise<string> {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }

  // Append double-SHA256 checksum (first 4 bytes)
  const hash1 = await crypto.subtle.digest('SHA-256', bytes);
  const hash2 = await crypto.subtle.digest('SHA-256', hash1);
  const checksum = new Uint8Array(hash2.slice(0, 4));

  const withChecksum = new Uint8Array(bytes.length + 4);
  withChecksum.set(bytes);
  withChecksum.set(checksum, bytes.length);

  // Base58 encode
  let num = BigInt(0);
  for (const byte of withChecksum) {
    num = num * 256n + BigInt(byte);
  }

  let leadingZeros = 0;
  for (const byte of withChecksum) {
    if (byte === 0) leadingZeros++;
    else break;
  }

  const result: string[] = [];
  for (let i = 0; i < leadingZeros; i++) {
    result.push(BASE58_ALPHABET[0]);
  }
  while (num > 0n) {
    result.push(BASE58_ALPHABET[Number(num % 58n)]);
    num /= 58n;
  }

  return result.reverse().join('');
}

interface TrongridTx {
  txID: string;
  block_timestamp: number;
  blockNumber?: number;
  ret?: Array<{ contractRet?: string; fee?: number }>;
  raw_data?: { contract?: Array<{ parameter?: { value?: { owner_address?: string; to_address?: string; amount?: number } } }> };
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
      const contractRet = item.ret?.[0]?.contractRet;
      const status = !contractRet || contractRet === 'SUCCESS' ? 'success' as const : 'failed' as const;
      const gasFee = (item.ret?.[0]?.fee ?? 0).toString();
      const value = item.raw_data?.contract?.[0]?.parameter?.value;
      const amount = value?.amount?.toString() ?? '0';
      const [from, to] = await Promise.all([
        value?.owner_address ? hexToBase58(value.owner_address) : Promise.resolve(''),
        value?.to_address ? hexToBase58(value.to_address) : Promise.resolve(''),
      ]);

      entries.push({
        rawTs: item.block_timestamp,
        tx: {
          txHash: item.txID,
          type: 'coin',
          from,
          to,
          value: amount,
          symbol: 'TRX',
          decimals: 6,
          contractAddress: null,
          timestamp: 0,
          status,
          gasFee,
          methodId: null,
          blockNumber: item.blockNumber ?? null,
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
