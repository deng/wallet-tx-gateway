# CLAUDE.md

## Commands

```bash
npm run dev       # Start local Wrangler dev server on :8787
npm run deploy    # Deploy to Cloudflare Workers (uses dotenv for CLOUDFLARE_API_TOKEN)
npm test          # Run all tests via Vitest (no network needed)
npm run typecheck # Type-check with tsc --noEmit
npm run test:watch# Watch mode for tests
npm run generate-sdk # Regenerate Flutter SDK from live OpenAPI spec
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/transactions` | Fetch wallet tx history for an address + chain |
| GET | `/api/v1/chains` | List all supported chains |
| GET | `/health` | Health check |

## Environment Variables

| Var | Type | Description |
|-----|------|-------------|
| `TX_CACHE_TTL` | wrangler.toml | Cache TTL in seconds (default 30) |
| `ETHERSCAN_API_KEY` | secret | Default Etherscan API key |
| `TRONGRID_API_KEY` | secret | Default Trongrid API key |
| `SOLSCAN_API_KEY` | secret | Default Solscan API key |
| `SUISCAN_API_KEY` | secret | Default Suiscan API key |

Client API keys may be provided per-request via headers:
- `X-Etherscan-Key` → used for ETH/BSC/POL (+ testnets)
- `X-Trongrid-Key` → used for TRX (+ Shasta/Nile)
- `X-Solscan-Key` → used for SOL (+ devnet)
- `X-Suiscan-Key` → used for SUI (+ testnet)

## Supported Chains

| Chain | chainId (mainnet) |
|-------|-------------------|
| Ethereum | `eip155:1` |
| BSC | `eip155:56` |
| Polygon | `eip155:137` |
| TRON | `tron:0x2b6653dc` |
| Aptos | `aptos:1` |
| Solana | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` |
| Sui | `sui:mainnet` |

Testnet chains are supported with their respective chain IDs.

## Architecture

**Providers:** Each chain group has an independent provider under `src/providers/`:
- `evm.ts` — ETH/BSC/POL + testnets via Etherscan-family APIs
- `tron.ts` — TRX + Shasta/Nile via Trongrid
- `aptos.ts` — APT + testnet via Aptos Indexer
- `solana.ts` — SOL + devnet via Solscan
- `sui.ts` — SUI + testnet via Suiscan

**Caching:** In-memory Map with 30s TTL, stale cache fallback on upstream failure.
