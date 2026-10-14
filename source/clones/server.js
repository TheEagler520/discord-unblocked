import { createBareServer } from "@nebula-services/bare-server-node";
import { createServer } from "http";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const bare = createBareServer("/bare/", {
    logErrors: true,
    blockLocal: false,
});

wisp.options.allow_loopback_ips = true;
wisp.options.allow_private_ips = true;

const fastify = Fastify({
    serverFactory: (handler) => {
        return createServer()
            .on("request", (req, res) => {
                res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

                if (bare.shouldRoute(req)) {
                    bare.routeRequest(req, res);
                } else {
                    handler(req, res);
                }
            })
            .on("upgrade", (req, socket, head) => {
                if (bare.shouldRoute(req)) {
                    bare.routeUpgrade(req, socket, head);
                } else {
                    wisp.routeRequest(req, socket, head);
                }
            });
    },
});

const serverRoot = process.env.VERCEL
    ? join(process.cwd(), "ScramJet")
    : fileURLToPath(new URL(".", import.meta.url));
const libcurlDistPath = process.env.VERCEL
    ? join(serverRoot, "libcurl-dist")
    : join(serverRoot, "node_modules/.pnpm/node_modules/@mercuryworkshop/libcurl-transport/dist");

fastify.register(fastifyStatic, {
    root: join(serverRoot, "static"),
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: join(serverRoot, "packages/core/dist"),
    prefix: "/scramjet/",
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: join(serverRoot, "packages/core/dist"),
    prefix: "/scram/",
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: join(serverRoot, "packages/controller/dist"),
    prefix: "/controller/",
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: join(serverRoot, "assets"),
    prefix: "/assets/",
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: libcurlDistPath,
    prefix: "/libcurl/",
    decorateReply: false,
});

fastify.setNotFoundHandler((request, reply) => {
    console.error("PAGE PUNCHED THROUGH SW - " + request.url);
    reply.code(593).statusMessage("INVALID").send("punch through");
});

await fastify.ready();

export { fastify };
export default fastify.server;
