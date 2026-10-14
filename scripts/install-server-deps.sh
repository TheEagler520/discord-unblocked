#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRAMJET_DIR="$ROOT_DIR/ScramJet"

if ! node -e '
const pkg = require(process.argv[1]);
const dependencies = ["@nebula-services/bare-server-node", "fastify", "@fastify/static"];
const staticVersion = pkg.dependencies?.["@fastify/static"];
process.exit(dependencies.every((name) => pkg.dependencies?.[name]) && staticVersion?.startsWith("^8.") ? 0 : 1);
' "$SCRAMJET_DIR/package.json"; then
    pnpm --dir "$SCRAMJET_DIR" add --workspace-root \
        '@nebula-services/bare-server-node@^2' \
        'fastify@^5' \
        '@fastify/static@^8'
fi
