import { describe, it, expect, vi, afterEach } from 'vitest';

const MOCK_BLOCKBERRY_TXS = {
  content: [
    {
      txHash: '0xsuihash1',
      senderAddress: '0xfromsui',
      recipients: ['0xtosui'],
      txStatus: 'SUCCESS',
      fee: 100000,
      timestamp: 1717000000000,
      checkpoint: 12345,
      balanceChanges: [
        { owner: { addressOwner: '0xfromsui' }, coinType: '0x2::sui::SUI', amount: '-1000000000' },
        { owner: { addressOwner: '0xtosui' }, coinType: '0x2::sui::SUI', amount: '1000000000' },
      ],
    },
  ],
  nextCursor: null,
  hasNextPage: false,
};

const MOCK_BLOCKBERRY_EMPTY = {
  content: [],
  nextCursor: null,
  hasNextPage: false,
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

describe('SUI Provider (Blockberry)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return SUI transactions from Blockberry API', async () => {
    let callCount = 0;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      callCount++;
      if (url.includes('blockberry.one') && url.includes('SENDER')) {
        return new Response(JSON.stringify(MOCK_BLOCKBERRY_TXS), { status: 200 });
      }
      if (url.includes('blockberry.one') && url.includes('RECEIVER')) {
        return new Response(JSON.stringify(MOCK_BLOCKBERRY_EMPTY), { status: 200 });
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
    expect(txs[0].from).toBe('0xfromsui');
    expect(txs[0].to).toBe('0xtosui');
    expect(txs[0].blockNumber).toBe(12345);
    expect(callCount).toBe(2); // SENDER + RECEIVER
  });

  it('should use X-Suiscan-Key header with Blockberry', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      new Response(JSON.stringify({ content: [], nextCursor: null, hasNextPage: false }), { status: 200 }),
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
