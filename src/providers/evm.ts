import { TransactionItem, TokenTransfer } from '../types';

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

function normalizeTx(item: EtherscanTx, symbol: string, decimals: number | null, contractAddress: string | null): TransactionItem {
  const gasUsed = BigInt(item.gasUsed || '0');
  const gasPrice = BigInt(item.gasPrice || '0');
  const gasFee = (gasUsed * gasPrice).toString();
  const isError = item.isError === '1';

  return {
    txHash: item.hash,
    type: contractAddress ? 'token' : 'coin',
    from: item.from,
    to: item.to,
    value: item.value,
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
          value: item.value,
          decimals,
        } as TokenTransfer]
      : [],
  };
}

export async function fetchTransactions(
  address: string,
  skip: number,
  limit: number,
  apiKey: string | undefined,
  baseUrl: string,
  symbol: string,
): Promise<{ total: number; transactions: TransactionItem[] }> {
  const pageSize = skip + limit; // fetch enough from upstream, then slice
  const page = 1;
  const offset = pageSize;

  const [txlistRes, tokentxRes] = await Promise.all([
    fetch(`${baseUrl}?module=account&action=txlist&address=${encodeURIComponent(address)}&page=${page}&offset=${offset}&sort=desc${apiKey ? `&apikey=${apiKey}` : ''}`, {
      signal: AbortSignal.timeout(10_000),
    }),
    fetch(`${baseUrl}?module=account&action=tokentx&address=${encodeURIComponent(address)}&page=${page}&offset=${offset}&sort=desc${apiKey ? `&apikey=${apiKey}` : ''}`, {
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

  const txs: TransactionItem[] = [];
  const txResults = txData.result as EtherscanTx[];
  const tokenResults = tokenData.result as EtherscanTokenTx[];

  for (const item of txResults) {
    txs.push(normalizeTx(item, symbol, null, null));
  }
  for (const item of tokenResults) {
    txs.push(normalizeTx(
      item,
      item.tokenSymbol,
      parseInt(item.tokenDecimal, 10) || null,
      item.contractAddress,
    ));
  }

  // Sort by timestamp descending
  txs.sort((a, b) => b.timestamp - a.timestamp);

  const total = txs.length;
  const sliced = txs.slice(skip, skip + limit);

  return { total, transactions: sliced };
}
