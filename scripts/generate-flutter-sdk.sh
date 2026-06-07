#!/bin/bash
# Generate Flutter SDK from live OpenAPI spec
# Usage: ./scripts/generate-flutter-sdk.sh [spec_url]

SPEC_URL="${1:-https://wallet-tx.bithub.pro/openapi.json}"
OUTPUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/wallet-tx-gateway-flutter"

openapi-generator generate \
  -i "$SPEC_URL" \
  -g dart \
  -o "$OUTPUT_DIR" \
  --additional-properties=pubName=wallet_tx_gateway,pubVersion=0.1.0,pubDescription="ZeroWallet Wallet Transactions Gateway API client for Flutter",useJsonKey=true,sortParamsByRequiredFlag=true
