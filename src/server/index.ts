import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";

import { Config } from "@server/helpers/config";
import { connectToDatabase } from "@server/helpers/db";
import { createHttpAdapter, onError } from "@server/helpers/elysia";
import { plugins } from "@server/helpers/plugins";
import { io } from "@server/helpers/socket";
import { Path } from "@shared/constants";

const { PORT, HOST } = Config;

(async () => {
	await connectToDatabase();

	const app = new Elysia({ aot: true, precompile: true, nativeStaticResponse: true })
		.onError(c => onError(c))
		.use(plugins);

	if (existsSync(Path.Public)) {
		app.use(staticPlugin({ prefix: "/", assets: Path.Public, noCache: true }));
	}

	const server = createServer(createHttpAdapter(app));

	io.attach(server);

	server.listen(PORT, () => console.log(`Server listening on ${HOST}:${PORT}`));
})();
