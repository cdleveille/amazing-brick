import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import nocache from "nocache";
import path from "path";

import { Config } from "@helpers";
import { connectToDatabase, initSocket, log } from "@services";

const { IS_PROD, HOST, PORT, RELOAD_PORT, SKIP_DB } = Config;

if (!IS_PROD) {
	const { buildClient } = await import("@processes");
	await buildClient();
}

const PUBLIC_DIR = path.join(process.cwd(), "public");

if (!SKIP_DB) await connectToDatabase();

const app = express();
app.use(nocache());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			baseUri: ["'self'"],
			childSrc: ["'self'"],
			connectSrc: ["'self'", ...(!IS_PROD ? [`ws://localhost:${RELOAD_PORT}`] : [])],
			fontSrc: ["'self'", "https:", "data:"],
			formAction: ["'self'"],
			frameAncestors: ["'self'"],
			frameSrc: ["'self'"],
			imgSrc: ["'self'", "data:"],
			manifestSrc: ["'self'"],
			mediaSrc: ["'self'"],
			objectSrc: ["'self'"],
			scriptSrc: ["'self'"],
			scriptSrcAttr: ["'none'"],
			scriptSrcElem: ["'self'"],
			styleSrc: ["'self'", "https:", "'unsafe-inline'"],
			styleSrcAttr: ["'unsafe-inline'"],
			styleSrcElem: ["'self'", "https:", "'unsafe-inline'"],
			upgradeInsecureRequests: [],
			workerSrc: ["'self'", "blob:"]
		}
	})
);
app.use(compression());
app.use(
	cors({
		origin: "*",
		methods: ["GET"]
	})
);
app.use(express.static(PUBLIC_DIR));
app.set("json spaces", 2);
app.disable("x-powered-by");
const httpServer = createServer(app);
initSocket(httpServer);
httpServer.listen(PORT, () => {
	log.info(`Server started in ${IS_PROD ? "production" : "development"} mode - listening on ${HOST}:${PORT}`);
});
