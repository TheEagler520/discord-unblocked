#!/bin/bash
set -euo pipefail

maxRetries=3
count=0
devCommand="${REVISION_DEV_CMD:-node server.js}"

bash scripts/node.sh
bash scripts/downloader.sh
if ! node -e '
const pkg = require("./ScramJet/package.json");
const dependencies = ["@nebula-services/bare-server-node", "fastify", "@fastify/static"];
process.exit(dependencies.every((name) => pkg.dependencies?.[name]) ? 0 : 1);
'; then
    pnpm --dir ScramJet add --workspace-root \
        '@nebula-services/bare-server-node@^2' \
        'fastify@^5' \
        '@fastify/static@^10'
fi
node source/override.js

cd ScramJet
pnpm install

until [ "$count" -ge "$maxRetries" ]; do
    echo "Attempt $((count + 1))..."

    set +e
    eval "$devCommand"
    exitCode=$?
    set -e

    if [ "$exitCode" -eq 0 ]; then
        echo "All commands completed successfully."
        exit 0
    fi

    if [ "$exitCode" -eq 130 ]; then
        echo "Dev server interrupted by user."
        exit 130
    fi

    echo "Dev server exited with code $exitCode. Retrying..."
    count=$((count + 1))
    sleep 2
done

echo "Failed after $maxRetries attempts."
exit 1
