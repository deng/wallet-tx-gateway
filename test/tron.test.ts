import { describe, it, expect, vi, afterEach } from 'vitest';

const MOCK_TRX_NATIVE_RESPONSE = {
  data: [
    {
      txID: '0xabc123tron',
      block_timestamp: 1717000000,
      from: 'TFromAddress',
      to: 'TToAddress',
      value: '1000000000', // 1000 TRX (6 decimals)
      receipt: { result: 'SUCCESS' },
      raw_data: { contract: [{ parameter: { value: { amount: 1000000000 } } }] },
    },
  ],
  meta: { total: 1, page_size: 20 },
};

const MOCK_TRC20_RESPONSE = {
  data: [
    {
      tx_id: '0xusdttrontx',
      block_timestamp: 1717000001,
      from: 'TFromAddress',
      to: 'TToAddress',
      value: '50000000',
      token_info: { address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', symbol: 'USDT', decimals: 6 },
    },
  ],
  meta: { total: 1, page_size: 20 },
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

describe('TRON Provider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return merged TRX + TRC20 transactions', async () => {
    let callCount = 0;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      callCount++;
      if (url.includes('/v1/accounts/') && url.includes('/transactions') && !url.includes('/trc20')) {
        return new Response(JSON.stringify(MOCK_TRX_NATIVE_RESPONSE), { status: 200 });
      }
      if (url.includes('/transactions/trc20')) {
        return new Response(JSON.stringify(MOCK_TRC20_RESPONSE), { status: 200 });
      }
      throw new Error('unexpected URL: ' + url);
    });

    const app = await createApp();
    const res = await app.fetch(
      new Request('http://localhost/api/v1/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: 'TFromAddress',
          chain: 'tron:0x2b6653dc',
        }),
      }),
      mockEnv,
    );

    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(true);

    const data = body.data as Record<string, unknown>;
    expect(data.chain).toBe('tron:0x2b6653dc');

    const txs = data.transactions as Array<Record<string, unknown>>;
    expect(txs).toHaveLength(2);

    // TRC20 first (newer timestamp)
    expect(txs[0].txHash).toBe('0xusdttrontx');
    expect(txs[0].type).toBe('token');
    expect(txs[0].tokenTransfers).toHaveLength(1);

    // TRX second
    expect(txs[1].txHash).toBe('0xabc123tron');
    expect(txs[1].type).toBe('coin');
    expect(txs[1].symbol).toBe('TRX');

    expect(callCount).toBe(2);
  });

  it('should use X-Trongrid-Key header', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      if (url.includes('trongrid.io')) {
        return new Response(JSON.stringify({ data: [], meta: { total: 0, page_size: 20 } }), { status: 200 });
      }
      throw new Error('unexpected URL');
    });

    const app = await createApp();
    const res = await app.fetch(
      new Request('http://localhost/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Trongrid-Key': 'client-tron-key',
        },
        body: JSON.stringify({
          address: 'TFromAddress',
          chain: 'tron:0x2b6653dc',
        }),
      }),
      mockEnv,
    );
    expect(res.status).toBe(200);
  });
});
