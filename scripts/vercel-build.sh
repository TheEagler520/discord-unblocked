#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

bash scripts/downloader.sh
bash scripts/install-server-deps.sh
node source/override.js
pnpm --dir ScramJet exec rspack build --config rspack.config.ts
cp -R \
    ScramJet/node_modules/.pnpm/node_modules/@mercuryworkshop/libcurl-transport/dist \
    ScramJet/libcurl-dist
mkdir -p public
printf 'Application requests are routed to the API function.\n' > public/_vercel-output.txt
