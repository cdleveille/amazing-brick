import type { TConfig } from "@types";

export const Config = {
	IS_PROD: Bun.env.BUN_ENV === "production" || Bun.env.NODE_ENV === "production",
	HOST: Bun.env.HOST || "http://localhost",
	PORT: parseInt(Bun.env.PORT || "3000"),
	WS_PORT: parseInt(Bun.env.WS_PORT || "3001"),
	MONGO_URI: Bun.env.MONGO_URI || "mongodb://localhost:27017/amazing-brick",
	SKIP_DB: Bun.env.SKIP_DB === "true"
} as TConfig;
