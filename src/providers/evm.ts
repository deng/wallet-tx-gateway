import { TransactionItem, TokenTransfer } from '../types';
import { toLiteral } from '../utils';

interface EtherscanTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  isError: string;
  methodId?: string;
}

interface EtherscanTokenTx extends EtherscanTx {
  contractAddress: string;
  tokenSymbol: string;
  tokenDecimal: string;
}

interface EtherscanResponse {
  status: string;
  message: string;
  result: EtherscanTx[] | EtherscanTokenTx[];
}

function normalizeTx(item: EtherscanTx, symbol: string, value: string, decimals: number | null, contractAddress: string | null): TransactionItem {
  const gasUsed = BigInt(item.gasUsed || '0');
  const gasPrice = BigInt(item.gasPrice || '0');
  const gasFee = (gasUsed * gasPrice).toString();
  const isError = item.isError === '1';

  return {
    txHash: item.hash,
    type: contractAddress ? 'token' : 'coin',
    from: item.from,
    to: item.to,
    value,
    symbol,
    decimals,
    contractAddress,
    timestamp: parseInt(item.timeStamp, 10),
    status: isError ? 'failed' : 'success',
    gasFee,
    methodId: item.methodId ?? null,
    blockNumber: parseInt(item.blockNumber, 10),
    tokenTransfers: contractAddress
      ? [{
          contractAddress,
          symbol,
          from: item.from,
          to: item.to,
          value,
          decimals,
        } as TokenTransfer]
      : [],
  };
}

function buildUrl(baseUrl: string, action: string, address: string, chainId: string, page: number, offset: number, sort: string, apiKey?: string, contractAddress?: string): string {
  let url = `${baseUrl}?chainid=${chainId}&module=account&action=${action}&address=${encodeURIComponent(address)}&page=${page}&offset=${offset}&sort=${sort}`;
  if (apiKey) url += `&apikey=${apiKey}`;
  if (contractAddress) url += `&contractAddress=${encodeURIComponent(contractAddress)}`;
  return url;
}

export async function fetchTransactions(
  address: string,
  skip: number,
  limit: number,
  apiKey: string | undefined,
  baseUrl: string,
  symbol: string,
  chainId: string | undefined,
  nativeDecimals: number,
  contractAddress?: string,
): Promise<{ total: number; transactions: TransactionItem[] }> {
  if (!chainId) {
    throw new Error('Etherscan API error: missing chainId');
  }

  const pageSize = skip + limit;
  const page = 1;
  const offset = pageSize;
  const sort = 'desc';

  const txs: TransactionItem[] = [];

  if (contractAddress) {
    const url = buildUrl(baseUrl, 'tokentx', address, chainId, page, offset, sort, apiKey, contractAddress);
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      throw new Error(`Etherscan API error: ${res.status} ${res.statusText || 'Unknown Error'}`);
    }
    const data = await res.json() as EtherscanResponse;
    if (data.status !== '1' && !Array.isArray(data.result)) {
      throw new Error(`Etherscan API error: ${data.message || 'Unknown'}`);
    }
    const tokenResults = data.result as EtherscanTokenTx[];
    for (const item of tokenResults) {
      const tokenDecimals = parseInt(item.tokenDecimal, 10) || null;
      txs.push(normalizeTx(item, item.tokenSymbol, toLiteral(item.value, tokenDecimals), tokenDecimals, item.contractAddress));
    }
  } else {
    const [txlistRes, tokentxRes] = await Promise.all([
      fetch(buildUrl(baseUrl, 'txlist', address, chainId, page, offset, sort, apiKey), {
        signal: AbortSignal.timeout(10_000),
      }),
      fetch(buildUrl(baseUrl, 'tokentx', address, chainId, page, offset, sort, apiKey), {
        signal: AbortSignal.timeout(10_000),
      }),
    ]);

    if (!txlistRes.ok) {
      throw new Error(`Etherscan API error: ${txlistRes.status} ${txlistRes.statusText || 'Unknown Error'}`);
    }
    if (!tokentxRes.ok) {
      throw new Error(`Etherscan API error: ${tokentxRes.status} ${tokentxRes.statusText || 'Unknown Error'}`);
    }

    const txData = await txlistRes.json() as EtherscanResponse;
    const tokenData = await tokentxRes.json() as EtherscanResponse;

    if (txData.status !== '1' && !Array.isArray(txData.result)) {
      throw new Error(`Etherscan API error: ${txData.message || 'Unknown'}`);
    }
    if (tokenData.status !== '1' && !Array.isArray(tokenData.result)) {
      throw new Error(`Etherscan API error: ${tokenData.message || 'Unknown'}`);
    }

    const txResults = txData.result as EtherscanTx[];
    const tokenResults = tokenData.result as EtherscanTokenTx[];

    for (const item of txResults) {
      txs.push(normalizeTx(item, symbol, toLiteral(item.value, nativeDecimals), nativeDecimals, null));
    }
    for (const item of tokenResults) {
      const tokenDecimals = parseInt(item.tokenDecimal, 10) || null;
      txs.push(normalizeTx(item, item.tokenSymbol, toLiteral(item.value, tokenDecimals), tokenDecimals, item.contractAddress));
    }
  }

  txs.sort((a, b) => b.timestamp - a.timestamp);

  const total = txs.length;
  const sliced = txs.slice(skip, skip + limit);

  return { total, transactions: sliced };
}
