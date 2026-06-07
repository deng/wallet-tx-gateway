import { describe, it, expect, vi, afterEach } from 'vitest';

const MOCK_SOL_TRANSFERS = {
  success: true,
  data: [
    {
      txHash: '0xsolhash1',
      blockTime: 1717000000,
      fromAddress: 'SolFromAddress',
      toAddress: 'SolToAddress',
      amount: 1000000000, // 1 SOL (9 decimals)
      status: 'success',
      fee: 5000,
    },
  ],
  total: 1,
};

const MOCK_SPL_TRANSFERS = {
  success: true,
  data: [
    {
      txHash: '0xsolusdthash',
      blockTime: 1717000001,
      fromAddress: 'SolFromAddress',
      toAddress: 'SolToAddress',
      amount: 1000000000,
      tokenAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      tokenSymbol: 'USDT',
      decimals: 6,
      status: 'success',
      fee: 5000,
    },
  ],
  total: 1,
};

const mockEnv = {
  ETHERSCAN_API_KEY: 'test-etherscan-key',
  TRONGRID_API_KEY: 'test-tron-key',
  SOLSCAN_API_KEY: 'test-solscan-key',
  SUISCAN_API_KEY: 'test-suiscan-key',
  TX_CACHE_TTL: '30',
};

async function createApp() {
  vi.resetModules();
  const mod = await import('../src/index');
  if (typeof (mod as any).resetCache === 'function') {
    (mod as any).resetCache();
  }
  return mod.default;
}

describe('SOLANA Provider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return SOL transactions', async () => {
    let callCount = 0;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      callCount++;
      if (url.includes('solscan.io')) {
        if (url.includes('/account/transfer')) {
          return new Response(JSON.stringify(MOCK_SOL_TRANSFERS), { status: 200 });
        }
        if (url.includes('/account/token')) {
          return new Response(JSON.stringify(MOCK_SPL_TRANSFERS), { status: 200 });
        }
      }
      throw new Error('unexpected URL: ' + url);
    });

    const app = await createApp();
    const res = await app.fetch(
      new Request('http://localhost/api/v1/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: 'SolFromAddress',
          chain: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
        }),
      }),
      mockEnv,
    );

    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(true);

    const txs = (body.data as Record<string, unknown>).transactions as Array<Record<string, unknown>>;
    expect(txs).toHaveLength(2);
    expect(txs[0].type).toBe('token');
    expect(txs[1].type).toBe('coin');
    expect(callCount).toBe(2);
  });
});
