export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Wallet Transactions Gateway',
    description: 'Proxies block explorer APIs (Etherscan, Trongrid, Solscan, etc.) to fetch wallet transaction history by address and chain (CAIP-2 format). Returns a normalized, merged list of coin and token transfers.',
    version: '0.1.0',
  },
  servers: [
    { url: 'https://wallet-tx.bithub.pro', description: 'Production' },
    { url: 'http://localhost:8787', description: 'Local dev' },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Service healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    timestamp: { type: 'string', format: 'date-time' },
                    version: { type: 'string', example: '0.1.0' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/chains': {
      get: {
        summary: 'List supported chains',
        description: 'Returns all supported chains with CAIP-2 identifiers and metadata.',
        tags: ['Chains'],
        responses: {
          '200': {
            description: 'Chain list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Chain' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/transactions': {
      post: {
        summary: 'Fetch wallet transactions',
        description: 'Fetch transaction history for a wallet address on a specific chain. Returns merged coin and token transfers sorted by timestamp descending.',
        tags: ['Transactions'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['address', 'chain'],
                properties: {
                  address: {
                    type: 'string',
                    description: 'Wallet address',
                    example: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                  },
                  chain: {
                    type: 'string',
                    description: 'CAIP-2 chain identifier',
                    example: 'eip155:1',
                  },
                  skip: {
                    type: 'integer',
                    description: 'Number of records to skip (default: 0)',
                    example: 0,
                    minimum: 0,
                  },
                  limit: {
                    type: 'integer',
                    description: 'Max records to return (default: 20, max: 50)',
                    example: 20,
                    minimum: 1,
                    maximum: 50,
                  },
                  type: {
                    type: 'string',
                    description: 'Filter by transaction type (null/omit for all)',
                    enum: ['coin', 'token'],
                    nullable: true,
                  },
                  contractAddress: {
                    type: 'string',
                    description: 'Filter by token contract address',
                    example: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Transactions data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/TxData' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid request (missing/unsupported fields)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string' },
                  },
                },
              },
            },
          },
          '502': {
            description: 'Upstream API error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string' },
                  },
                },
              },
            },
          },
          '504': {
            description: 'Upstream API timeout',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Upstream API timeout' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Chain: {
        type: 'object',
        properties: {
          chain: { type: 'string', example: 'eip155:1' },
          name: { type: 'string', example: 'Ethereum' },
          nativeCurrency: { type: 'string', example: 'ETH' },
        },
      },
      TxData: {
        type: 'object',
        properties: {
          address: { type: 'string' },
          chain: { type: 'string' },
          transactions: {
            type: 'array',
            items: { $ref: '#/components/schemas/TransactionItem' },
          },
        },
      },
      TransactionItem: {
        type: 'object',
        properties: {
          txHash: { type: 'string' },
          type: { type: 'string', enum: ['coin', 'token'] },
          from: { type: 'string' },
          to: { type: 'string' },
          value: { type: 'string' },
          symbol: { type: 'string' },
          decimals: { type: 'integer', nullable: true },
          contractAddress: { type: 'string', nullable: true },
          timestamp: { type: 'integer' },
          status: { type: 'string', enum: ['success', 'failed', 'pending'] },
          gasFee: { type: 'string' },
          methodId: { type: 'string', nullable: true },
          blockNumber: { type: 'integer', nullable: true },
          tokenTransfers: {
            type: 'array',
            items: { $ref: '#/components/schemas/TokenTransfer' },
          },
        },
      },
      TokenTransfer: {
        type: 'object',
        properties: {
          contractAddress: { type: 'string', nullable: true },
          symbol: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' },
          value: { type: 'string' },
          decimals: { type: 'integer', nullable: true },
        },
      },
    },
  },
} as const;
