import { describe, it, expect, vi, afterEach } from 'vitest';

const MOCK_APTOS_TXS = [
  {
    version: '12345',
    hash: '0xapthash1',
    sender: '0xfromapt',
    success: true,
    timestamp: '1717000000000',
    gas_used: '1000',
    gas_unit_price: '100',
    payload: { type: 'entry_function_payload', function: '0x1::coin::transfer' },
    events: [
      {
        type: '0x1::coin::WithdrawEvent',
        data: { amount: '100000000' },
        guid: { account_address: '0xfromapt' },
      },
      {
        type: '0x1::coin::DepositEvent',
        data: { amount: '100000000' },
        guid: { account_address: '0xtoapt' },
      },
    ],
  },
];

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

describe('APTOS Provider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return APT transactions', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      if (url.includes('aptoslabs.com')) {
        return new Response(JSON.stringify(MOCK_APTOS_TXS), { status: 200 });
      }
      throw new Error('unexpected URL');
    });

    const app = await createApp();
    const res = await app.fetch(
      new Request('http://localhost/api/v1/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: '0xfromapt',
          chain: 'aptos:1',
        }),
      }),
      mockEnv,
    );

    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(true);

    const data = body.data as Record<string, unknown>;
    expect(data.chain).toBe('aptos:1');
    const txs = data.transactions as Array<Record<string, unknown>>;
    expect(txs.length).toBeGreaterThanOrEqual(1);
    expect(txs[0].txHash).toBe('0xapthash1');
    expect(txs[0].type).toBe('coin');
    expect(txs[0].symbol).toBe('APT');
  });
});
