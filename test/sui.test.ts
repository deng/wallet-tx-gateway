import { describe, it, expect, vi, afterEach } from 'vitest';

const MOCK_SUI_TXS = {
  data: [
    {
      transactionDigest: '0xsuihash1',
      timestampMs: '1717000000000',
      sender: '0xfromsui',
      effects: { status: { status: 'success' } },
      balanceChanges: [
        { owner: { AddressOwner: '0xfromsui' }, coinType: '0x2::sui::SUI', amount: '-1000000000' },
        { owner: { AddressOwner: '0xtosui' }, coinType: '0x2::sui::SUI', amount: '1000000000' },
      ],
      gasFee: { gasUsed: 1000, gasPrice: 100 },
    },
  ],
  total: 1,
};

const mockEnv = {
  ETHERSCAN_API_KEY: 'test-key',
  TRONGRID_API_KEY: 'test-key',
  SOLSCAN_API_KEY: 'test-key',
  SUISCAN_API_KEY: 'test-key',
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

describe('SUI Provider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return SUI transactions', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      if (url.includes('suiscan.xyz')) {
        return new Response(JSON.stringify(MOCK_SUI_TXS), { status: 200 });
      }
      throw new Error('unexpected URL: ' + url);
    });

    const app = await createApp();
    const res = await app.fetch(
      new Request('http://localhost/api/v1/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: '0xfromsui',
          chain: 'sui:mainnet',
        }),
      }),
      mockEnv,
    );

    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(true);

    const txs = (body.data as Record<string, unknown>).transactions as Array<Record<string, unknown>>;
    expect(txs.length).toBeGreaterThanOrEqual(1);
    expect(txs[0].txHash).toBe('0xsuihash1');
    expect(txs[0].type).toBe('coin');
    expect(txs[0].symbol).toBe('SUI');
  });

  it('should use X-Suiscan-Key header', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: [], total: 0 }), { status: 200 }),
    );
    const app = await createApp();
    const res = await app.fetch(
      new Request('http://localhost/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Suiscan-Key': 'client-sui-key',
        },
        body: JSON.stringify({
          address: '0xfromsui',
          chain: 'sui:mainnet',
        }),
      }),
      mockEnv,
    );
    expect(res.status).toBe(200);
  });
});
