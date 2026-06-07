import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const MOCK_TXLIST_RESPONSE = {
  status: '1',
  message: 'OK',
  result: [
    {
      blockNumber: '20000000',
      timeStamp: '1717000000',
      hash: '0xabc123',
      from: '0xfrom',
      to: '0xto',
      value: '1000000000000000000',
      gas: '21000',
      gasPrice: '10000000000',
      gasUsed: '21000',
      isError: '0',
      methodId: '0x',
    },
  ],
};

const MOCK_TOKENTX_RESPONSE = {
  status: '1',
  message: 'OK',
  result: [],
};

const mockEnv = {
  ETHERSCAN_API_KEY: 'test-key',
  TRONGRID_API_KEY: 'test-key',
  SOLSCAN_API_KEY: 'test-key',
  SUISCAN_API_KEY: 'test-key',
  TX_CACHE_TTL: '30',
};

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

async function createApp() {
  vi.resetModules();
  const mod = await import('../src/index');
  if (typeof (mod as any).resetCache === 'function') {
    (mod as any).resetCache();
  }
  return mod.default;
}

// ---------------------------------------------------------------------------
// GET /health
// ---------------------------------------------------------------------------
describe('GET /health', () => {
  it('should return healthy status with all fields', async () => {
    const app = await createApp();
    const res = await app.fetch(mockRequest('GET', 'http://localhost/health'), mockEnv);
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.status).toBe('healthy');
    expect(body.timestamp).toBeDefined();
    expect(typeof body.timestamp).toBe('string');
    expect(body.version).toBe('0.1.0');
  });
});

// ---------------------------------------------------------------------------
// OpenAPI spec and Swagger UI
// ---------------------------------------------------------------------------
describe('OpenAPI spec', () => {
  it('should serve OpenAPI JSON at /openapi.json', async () => {
    const app = await createApp();
    const res = await app.fetch(mockRequest('GET', 'http://localhost/openapi.json'), mockEnv);
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.openapi).toBe('3.0.3');
    expect(body.info).toBeDefined();
    expect((body.info as Record<string, unknown>).title).toBe('Wallet Transactions Gateway');
    expect(body.paths).toBeDefined();
    expect((body.paths as Record<string, unknown>)['/api/v1/transactions']).toBeDefined();
    expect((body.paths as Record<string, unknown>)['/api/v1/chains']).toBeDefined();
    expect((body.paths as Record<string, unknown>)['/health']).toBeDefined();
  });

  it('should serve Swagger UI at /docs', async () => {
    const app = await createApp();
    const res = await app.fetch(mockRequest('GET', 'http://localhost/docs'), mockEnv);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('swagger-ui');
    expect(text).toContain('/openapi.json');
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/chains
// ---------------------------------------------------------------------------
describe('GET /api/v1/chains', () => {
  it('should return chain list with required properties', async () => {
    const app = await createApp();
    const res = await app.fetch(mockRequest('GET', 'http://localhost/api/v1/chains'), mockEnv);
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(true);

    const data = body.data as Array<Record<string, unknown>>;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(15);

    const eth = data.find((c) => c.chain === 'eip155:1');
    expect(eth).toBeDefined();
    expect(eth!.name).toBe('Ethereum');
    expect(eth!.nativeCurrency).toBe('ETH');

    const sol = data.find((c) => c.chain === 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
    expect(sol).toBeDefined();
    expect(sol!.nativeCurrency).toBe('SOL');
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/transactions
// ---------------------------------------------------------------------------
describe('POST /api/v1/transactions', () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should return normalized transactions for valid request', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      if (url.includes('action=txlist')) {
        return new Response(JSON.stringify(MOCK_TXLIST_RESPONSE), { status: 200 });
      }
      if (url.includes('action=tokentx')) {
        return new Response(JSON.stringify(MOCK_TOKENTX_RESPONSE), { status: 200 });
      }
      throw new Error('fetch failed');
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
    expect((data.transactions as Array<unknown>).length).toBe(1);
  });

  it('should return 400 when address is missing', async () => {
    const app = await createApp();
    const res = await app.fetch(
      mockRequest('POST', 'http://localhost/api/v1/transactions', { chain: 'eip155:1' }),
      mockEnv,
    );
    expect(res.status).toBe(400);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(false);
    expect(body.error).toBe("Field 'address' is required");
  });

  it('should return 400 when chain is missing', async () => {
    const app = await createApp();
    const res = await app.fetch(
      mockRequest('POST', 'http://localhost/api/v1/transactions', {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      }),
      mockEnv,
    );
    expect(res.status).toBe(400);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(false);
    expect(body.error).toBe("Field 'chain' is required");
  });

  it('should return 400 for unsupported chain', async () => {
    const app = await createApp();
    const res = await app.fetch(
      mockRequest('POST', 'http://localhost/api/v1/transactions', {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        chain: 'eip155:999',
      }),
      mockEnv,
    );
    expect(res.status).toBe(400);
    const body = await res.json() as Record<string, unknown>;
    expect(body.error).toContain("Unsupported chain: 'eip155:999'");
    expect(body.error).toContain('Supported:');
    expect(body.error).toContain('eip155:1');
  });

  it('should return 504 on API timeout', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new DOMException('The operation was aborted', 'AbortError'),
    );
    const app = await createApp();
    const res = await app.fetch(
      mockRequest('POST', 'http://localhost/api/v1/transactions', {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        chain: 'eip155:1',
      }),
      mockEnv,
    );
    expect(res.status).toBe(504);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(false);
    expect(body.error).toBe('Upstream API timeout');
  });

  it('should return 502 on upstream API error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Rate limited', { status: 429, statusText: 'Too Many Requests' }),
    );
    const app = await createApp();
    const res = await app.fetch(
      mockRequest('POST', 'http://localhost/api/v1/transactions', {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        chain: 'eip155:1',
      }),
      mockEnv,
    );
    expect(res.status).toBe(502);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(false);
    expect(body.error).toContain('Etherscan API error: 429');
  });

  it('should return 502 on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('connect ECONNREFUSED'));
    const app = await createApp();
    const res = await app.fetch(
      mockRequest('POST', 'http://localhost/api/v1/transactions', {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        chain: 'eip155:1',
      }),
      mockEnv,
    );
    expect(res.status).toBe(502);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(false);
    expect(body.error).toBe('Upstream request failed');
  });
});

// ---------------------------------------------------------------------------
// Caching
// ---------------------------------------------------------------------------
describe('Caching', () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should serve cached data on second request (fetch only called once)', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      if (url.includes('action=txlist') || url.includes('action=tokentx')) {
        return new Response(JSON.stringify(
          url.includes('txlist') ? MOCK_TXLIST_RESPONSE : MOCK_TOKENTX_RESPONSE,
        ), { status: 200 });
      }
      throw new Error('fetch failed');
    });

    const app = await createApp();
    const requestBody = {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      chain: 'eip155:1',
    };

    const res1 = await app.fetch(
      mockRequest('POST', 'http://localhost/api/v1/transactions', requestBody),
      mockEnv,
    );
    expect(res1.status).toBe(200);

    const res2 = await app.fetch(
      mockRequest('POST', 'http://localhost/api/v1/transactions', requestBody),
      mockEnv,
    );
    expect(res2.status).toBe(200);
    // fetch should have been called exactly 2 times (txlist + tokentx from first request)
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});

// ---------------------------------------------------------------------------
// CORS headers
// ---------------------------------------------------------------------------
describe('CORS headers', () => {
  it('should include access-control-allow-origin: *', async () => {
    const app = await createApp();
    const res = await app.fetch(mockRequest('GET', 'http://localhost/health'), mockEnv);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('should respond to OPTIONS preflight with correct CORS headers', async () => {
    const app = await createApp();
    const res = await app.fetch(
      new Request('http://localhost/api/v1/transactions', { method: 'OPTIONS' }),
      mockEnv,
    );
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    const allowMethods = res.headers.get('access-control-allow-methods');
    expect(allowMethods).toContain('GET');
    expect(allowMethods).toContain('POST');
    expect(res.headers.get('access-control-max-age')).toBe('86400');
  });
});
