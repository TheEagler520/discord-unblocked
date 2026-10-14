#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

bash scripts/downloader.sh
bash scripts/install-server-deps.sh
node source/override.js
pnpm --dir ScramJet exec rspack build --config rspack.config.ts
mkdir -p public
