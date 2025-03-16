import { Elysia } from "elysia";

import { Env, Path } from "@constants";
import { staticPlugin } from "@elysiajs/static";
import { Config } from "@helpers";
import { connectToDatabase, initSocket, log } from "@services";

const { IS_PROD, PORT, SKIP_DB } = Config;

const buildIfDev = IS_PROD ? [] : [(await import("@processes")).buildClient()];

const connectDb = SKIP_DB ? [] : [connectToDatabase()];

await Promise.all([initSocket(), ...buildIfDev, ...connectDb]);

new Elysia().use(staticPlugin({ prefix: "/", assets: Path.Public, noCache: true })).listen(PORT);

log.info(`HTTP server listening on port ${PORT} in ${IS_PROD ? Env.Production : Env.Development} mode`);
