import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";

import { Config, isCustomHost } from "@server/helpers/config";

const { HOST, PORT } = Config;

const WS_HOST = HOST.replace("http", "ws");

const connectSrc = isCustomHost ? ["'self'", `${HOST}:${PORT}`, `${WS_HOST}:${PORT}`] : ["*"];

export const plugins = new Elysia().use(cors()).use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				baseUri: ["'self'"],
				childSrc: ["'self'"],
				connectSrc,
				defaultSrc: ["'self'"],
				fontSrc: ["'self'", "https:", "data:"],
				formAction: ["'self'"],
				frameAncestors: ["'self'"],
				imgSrc: ["'self'", "data:"],
				manifestSrc: ["'self'"],
				mediaSrc: ["'self'"],
				objectSrc: ["'none'"],
				scriptSrc: ["'self'"],
				scriptSrcAttr: ["'none'"],
				scriptSrcElem: ["'self'"],
				styleSrc: ["'self'"],
				styleSrcAttr: ["'self'", "'unsafe-inline'"],
				styleSrcElem: ["'self'", "'unsafe-inline'"],
				upgradeInsecureRequests: [],
				workerSrc: ["'self'"]
			}
		}
	})
);
