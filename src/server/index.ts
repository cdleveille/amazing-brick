import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

import { Config } from "@helpers";
import { connectToDatabase, initSocket, log } from "@services";

const { IS_PROD, HOST, PORT, WS_PORT, SKIP_DB } = Config;
const WS_HOST = HOST.replace("http", "ws");

const buildIfDev = IS_PROD ? [] : [(await import("@processes")).buildClient()];

const connectDb = SKIP_DB ? [] : [connectToDatabase()];

await Promise.all([...buildIfDev, ...connectDb]);

const app = new Hono({ strict: false });

app.use(cors());

app.use(
	secureHeaders({
		contentSecurityPolicy: {
			defaultSrc: ["'self'"],
			baseUri: ["'self'"],
			childSrc: ["'self'"],
			connectSrc: ["'self'", `${HOST}:${WS_PORT}`, `${WS_HOST}:${WS_PORT}`],
			fontSrc: ["'self'", "https:", "data:"],
			formAction: ["'self'"],
			frameAncestors: ["'self'"],
			frameSrc: ["'self'"],
			imgSrc: ["'self'", "data:"],
			manifestSrc: ["'self'"],
			mediaSrc: ["'self'"],
			objectSrc: ["'none'"],
			scriptSrc: ["'self'"],
			scriptSrcAttr: ["'none'"],
			scriptSrcElem: ["'self'"],
			styleSrc: ["'self'", "https:", "'unsafe-inline'"],
			styleSrcAttr: ["'self'", "https:", "'unsafe-inline'"],
			styleSrcElem: ["'self'", "https:", "'unsafe-inline'"],
			upgradeInsecureRequests: [],
			workerSrc: ["'self'", "blob:"]
		}
	})
);

app.get(
	"/*",
	serveStatic({
		root: "./public",
		onFound: (_path, c) => c.header("Cache-Control", "no-store")
	})
);

initSocket();

log.info(`HTTP server started on port ${PORT} in ${IS_PROD ? "production" : "development"} mode`);

export default {
	port: Config.PORT,
	fetch: app.fetch
};
