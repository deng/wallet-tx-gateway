import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';
import { getChainInfo, getAllChains } from './chains';
import { openApiSpec } from './openapi';
import { fetchTransactions as fetchEvm } from './providers/evm';
import { fetchTransactions as fetchTron } from './providers/tron';
import { fetchTransactions as fetchAptos } from './providers/aptos';
import { fetchTransactions as fetchSolana } from './providers/solana';
import { fetchTransactions as fetchSui } from './providers/sui';
import type { Env, TxResponse, ChainsResponse, HealthResponse, TransactionItem } from './types';

interface CacheEntry {
  data: any;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function getCacheKey(chain: string, address: string): string {
  return `${chain}:${address.toLowerCase()}`;
}

function getCached(key: string, acceptStale = false): any {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (acceptStale || Date.now() < entry.expiresAt) {
    return entry.data;
  }
  return undefined;
}

function setCache(key: string, data: any, ttl: number): void {
  cache.set(key, { data, expiresAt: Date.now() + ttl * 1000 });
}

export function resetCache(): void {
  cache.clear();
}

function filterTransactions(txs: TransactionItem[], type?: string, contractAddress?: string): TransactionItem[] {
  let filtered = txs;
  if (type) {
    filtered = filtered.filter((tx) => tx.type === type);
  }
  if (contractAddress) {
    filtered = filtered.filter((tx) => tx.contractAddress?.toLowerCase() === contractAddress.toLowerCase());
  }
  return filtered;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-Etherscan-Key', 'X-Trongrid-Key', 'X-Solscan-Key', 'X-Suiscan-Key'],
  maxAge: 86400,
}));

app.get('/openapi.json', (c) => c.json(openApiSpec));
app.get('/docs', swaggerUI({ url: '/openapi.json' }));

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  } satisfies HealthResponse);
});

app.get('/api/v1/chains', (c) => {
  const chains = getAllChains().map((ci) => ({
    chain: ci.caip2,
    name: ci.name,
    nativeCurrency: ci.nativeCurrency,
  }));
  return c.json({ success: true, data: chains } satisfies ChainsResponse);
});

app.post('/api/v1/transactions', async (c) => {
  let body: { address?: string; chain?: string; skip?: number; limit?: number; type?: string; contractAddress?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: 'Invalid JSON body' } satisfies TxResponse, 400);
  }

  if (!body.address) {
    return c.json({ success: false, error: "Field 'address' is required" } satisfies TxResponse, 400);
  }
  if (!body.chain) {
    return c.json({ success: false, error: "Field 'chain' is required" } satisfies TxResponse, 400);
  }
  if (body.type != null && body.type !== 'coin' && body.type !== 'token') {
    return c.json({ success: false, error: "Field 'type' must be 'coin', 'token', or null" } satisfies TxResponse, 400);
  }

  const chainInfo = getChainInfo(body.chain);
  if (!chainInfo) {
    const supported = getAllChains().map((c) => c.caip2).join(', ');
    return c.json({
      success: false,
      error: `Unsupported chain: '${body.chain}'. Supported: ${supported}`,
    } satisfies TxResponse, 400);
  }

  const { address, chain } = body;
  const skip = body.skip ?? 0;
  const limit = Math.min(body.limit ?? 20, 50);
  const cacheKey = getCacheKey(chain, address);
  const ttl = parseInt(c.env.TX_CACHE_TTL || '30', 10);

  const cached = getCached(cacheKey);
  if (cached) {
    const filtered = filterTransactions(cached.transactions, body.type, body.contractAddress);
    return c.json({ success: true, data: { ...cached, transactions: filtered } } satisfies TxResponse);
  }

  function handleUpstreamError(err: unknown): Response {
    const stale = getCached(cacheKey, true);
    if (stale) {
      const filtered = filterTransactions(stale.transactions, body.type, body.contractAddress);
      return c.json({ success: true, data: { ...stale, transactions: filtered } } satisfies TxResponse);
    }
    const message = (err as Error).message;
    if (err instanceof DOMException && err.name === 'AbortError') {
      return c.json({ success: false, error: 'Upstream API timeout' } satisfies TxResponse, 504);
    }
    if (message.startsWith('Etherscan API error:') || message.startsWith('Trongrid API error:') || message.startsWith('Aptos API error:') || message.startsWith('Solscan API error:') || message.startsWith('Blockberry API error:')) {
      return c.json({ success: false, error: message } satisfies TxResponse, 502);
    }
    return c.json({ success: false, error: 'Upstream request failed' } satisfies TxResponse, 502);
  }

  try {
    if (chainInfo.provider === 'evm') {
      const apiKey = c.req.header('X-Etherscan-Key') || c.env.ETHERSCAN_API_KEY;
      const result = await fetchEvm(address, skip, limit, apiKey, chainInfo.baseUrl, chainInfo.symbol, chainInfo.chainId);
      const allTxs = result.transactions;
      const data = { address, chain, transactions: allTxs };
      setCache(cacheKey, data, ttl);
      const filtered = filterTransactions(allTxs, body.type, body.contractAddress);
      return c.json({ success: true, data: { ...data, transactions: filtered } } satisfies TxResponse);
    } else if (chainInfo.provider === 'tron') {
      const apiKey = c.req.header('X-Trongrid-Key') || c.env.TRONGRID_API_KEY;
      const result = await fetchTron(address, skip, limit, apiKey, chainInfo.baseUrl);
      const allTxs = result.transactions;
      const data = { address, chain, transactions: allTxs };
      setCache(cacheKey, data, ttl);
      const filtered = filterTransactions(allTxs, body.type, body.contractAddress);
      return c.json({ success: true, data: { ...data, transactions: filtered } } satisfies TxResponse);
    } else if (chainInfo.provider === 'aptos') {
      const result = await fetchAptos(address, skip, limit, undefined, chainInfo.baseUrl);
      const allTxs = result.transactions;
      const data = { address, chain, transactions: allTxs };
      setCache(cacheKey, data, ttl);
      const filtered = filterTransactions(allTxs, body.type, body.contractAddress);
      return c.json({ success: true, data: { ...data, transactions: filtered } } satisfies TxResponse);
    } else if (chainInfo.provider === 'solana') {
      const apiKey = c.req.header('X-Solscan-Key') || c.env.SOLSCAN_API_KEY;
      const result = await fetchSolana(address, skip, limit, apiKey, chainInfo.baseUrl);
      const allTxs = result.transactions;
      const data = { address, chain, transactions: allTxs };
      setCache(cacheKey, data, ttl);
      const filtered = filterTransactions(allTxs, body.type, body.contractAddress);
      return c.json({ success: true, data: { ...data, transactions: filtered } } satisfies TxResponse);
    } else if (chainInfo.provider === 'sui') {
      const apiKey = c.req.header('X-Suiscan-Key') || c.env.SUISCAN_API_KEY;
      const result = await fetchSui(address, skip, limit, apiKey, chainInfo.baseUrl);
      const allTxs = result.transactions;
      const data = { address, chain, transactions: allTxs };
      setCache(cacheKey, data, ttl);
      const filtered = filterTransactions(allTxs, body.type, body.contractAddress);
      return c.json({ success: true, data: { ...data, transactions: filtered } } satisfies TxResponse);
    }
    return c.json({ success: false, error: `Provider '${chainInfo.provider}' not yet implemented` } satisfies TxResponse, 502);
  } catch (err) {
    return handleUpstreamError(err);
  }
});

export default {
  fetch: app.fetch,
};
