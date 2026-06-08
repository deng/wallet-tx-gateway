import { describe, it, expect, vi, afterEach } from 'vitest';

const MOCK_TXLIST_RESPONSE = {
  status: '1',
  message: 'OK',
  result: [
    {
      blockNumber: '20000000',
      timeStamp: '1717000000',
      hash: '0xabc123def456',
      from: '0xfromaddress',
      to: '0xtoaddress',
      value: '1000000000000000000',
      gas: '21000',
      gasPrice: '10000000000',
      gasUsed: '21000',
      isError: '0',
      methodId: '0x',
    },
    {
      blockNumber: '19999999',
      timeStamp: '1716999999',
      hash: '0xdef456abc123',
      from: '0xfromaddress',
      to: '0xotherrecipient',
      value: '500000000000000000',
      gas: '21000',
      gasPrice: '15000000000',
      gasUsed: '21000',
      isError: '1',
      methodId: '0xa9059cbb',
    },
  ],
};

const MOCK_TOKENTX_RESPONSE = {
  status: '1',
  message: 'OK',
  result: [
    {
      blockNumber: '20000001',
      timeStamp: '1717000001',
      hash: '0xusdttxhash',
      from: '0xfromaddress',
      to: '0xtoaddress',
      value: '50000000',
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      tokenSymbol: 'USDT',
      tokenDecimal: '6',
      gas: '50000',
      gasPrice: '5000000000',
      gasUsed: '35000',
      isError: '0',
    },
  ],
};

const mockEnv = {
  ETHERSCAN_API_KEY: 'test-etherscan-key',
  TRONGRID_API_KEY: 'test-tron-key',
  SOLSCAN_API_KEY: 'test-solscan-key',
  SUISCAN_API_KEY: 'test-suiscan-key',
  TX_CACHE_TTL: '30',
};

async function createApp() {
  // Reset modules to clear cache between tests
  vi.resetModules();
  const mod = await import('../src/index');
  if (typeof (mod as any).resetCache === 'function') {
    (mod as any).resetCache();
  }
  return mod.default;
}

function mockRequest(method: string, url: string, body?: unknown): Request {
  if (body !== undefined) {
    return new Request(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }
  return new Request(url, { method });
}

describe('EVM Provider (ETH/BSC/POL)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return merged coin + token transactions for ETH', async () => {
    // Mock upstream: Etherscan txlist and tokentx
    let callCount = 0;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      callCount++;
      if (url.includes('action=txlist')) {
        return new Response(JSON.stringify(MOCK_TXLIST_RESPONSE), { status: 200 });
      }
      if (url.includes('action=tokentx')) {
        return new Response(JSON.stringify(MOCK_TOKENTX_RESPONSE), { status: 200 });
      }
      throw new Error('unexpected URL: ' + url);
    });

    const app = await createApp();
    const res = await app.fetch(
      mockRequest('POST', 'http://localhost/api/v1/transactions', {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        chain: 'eip155:1',
      }),
      mockEnv,
    );

    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(true);

    const data = body.data as Record<string, unknown>;
    expect(data.address).toBe('0xdAC17F958D2ee523a2206206994597C13D831ec7');
    expect(data.chain).toBe('eip155:1');

    const txs = data.transactions as Array<Record<string, unknown>>;
    // 2 coin + 1 token = 3 total, sorted by timestamp desc
    expect(txs).toHaveLength(3);

    // Token tx first (timestamp 1717000001)
    expect(txs[0].txHash).toBe('0xusdttxhash');
    expect(txs[0].type).toBe('token');
    expect(txs[0].symbol).toBe('USDT');
    expect(txs[0].value).toBe('50'); // 50000000 / 10^6
    expect(txs[0].decimals).toBe(6);
    expect(txs[0].tokenTransfers).toHaveLength(1);
    expect((txs[0].tokenTransfers as Array<Record<string, unknown>>)[0].value).toBe('50');

    // Coin tx second (timestamp 1717000000)
    expect(txs[1].txHash).toBe('0xabc123def456');
    expect(txs[1].type).toBe('coin');
    expect(txs[1].symbol).toBe('ETH');
    expect(txs[1].value).toBe('1'); // 10^18 / 10^18
    expect(txs[1].decimals).toBe(18);
    expect(txs[1].status).toBe('success');

    // Failed coin tx third (timestamp 1716999999)
    expect(txs[2].txHash).toBe('0xdef456abc123');
    expect(txs[2].type).toBe('coin');
    expect(txs[2].status).toBe('failed');

    // Should have called upstream 2 times (txlist + tokentx)
    expect(callCount).toBe(2);
  });

  it('should handle API key from header', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      if (url.includes('action=txlist')) {
        // Verify the request includes the API key as apikey param
        const urlObj = new URL(url);
        expect(urlObj.searchParams.get('apikey')).toBe('client-key');
        return new Response(JSON.stringify({ status: '1', message: 'OK', result: [] }), { status: 200 });
      }
      if (url.includes('action=tokentx')) {
        return new Response(JSON.stringify({ status: '1', message: 'OK', result: [] }), { status: 200 });
      }
      throw new Error('unexpected URL');
    });

    const app = await createApp();
    // Separate instances for test: the app processes the request normally
    // We need to pass the header
    const res = await app.fetch(
      new Request('http://localhost/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Etherscan-Key': 'client-key',
        },
        body: JSON.stringify({
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          chain: 'eip155:1',
        }),
      }),
      mockEnv,
    );

    expect(res.status).toBe(200);
  });

  it('should return 400 for unsupported chain', async () => {
    const app = await createApp();
    const res = await app.fetch(
      mockRequest('POST', 'http://localhost/api/v1/transactions', {
        address: '0xabc',
        chain: 'eip155:99999',
      }),
      mockEnv,
    );
    expect(res.status).toBe(400);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(false);
    expect(body.error).toContain('Unsupported chain');
  });
});
