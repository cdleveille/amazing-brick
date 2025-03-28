import { Elysia } from "elysia";

import { Env, Path } from "@constants";
import { staticPlugin } from "@elysiajs/static";
import { Config } from "@helpers";
import { connectToDatabase, initSocket, log } from "@services";

const { IS_PROD, PORT, SKIP_DB } = Config;

if (!SKIP_DB) connectToDatabase();

initSocket();

new Elysia()
	.use(staticPlugin({ prefix: "/", assets: Path.Public, noCache: true }))
	.listen(PORT, () =>
		log.info(`HTTP server listening on port ${PORT} in ${IS_PROD ? Env.Production : Env.Development} mode`)
	);
