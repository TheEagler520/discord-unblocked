import { chmodSync, writeFileSync } from "node:fs";
import { rspack } from "@rspack/core";
import rspackConfig from "./rspack.config.ts";
import { fastify } from "./server.js";

const port = Number(process.env.PORT) || 8080;

try {
    await fastify.listen({
        port,
        host: "0.0.0.0",
    });
    console.log(`\n[SUCCESS] Server listening on 0.0.0.0:${port}`);
} catch (error) {
    console.error(error);
    process.exit(1);
}

try {
    writeFileSync(".git/hooks/pre-commit", "pnpm prettier . -w\ngit update-index --again");
    chmodSync(".git/hooks/pre-commit", 0o755);
} catch {}

const compiler = rspack(rspackConfig);
compiler.watch({}, (error, stats) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(
        stats.toString({
            preset: "minimal",
            colors: true,
            version: false,
        }),
    );
});
