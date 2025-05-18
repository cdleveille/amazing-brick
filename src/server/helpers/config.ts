import { DefaultConfig } from "@shared/constants";
import type { TConfig } from "@shared/types";

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : DefaultConfig.PORT;

const HOST = process.env.HOST ?? DefaultConfig.HOST;

const MONGO_URI = process.env.MONGO_URI ?? DefaultConfig.MONGO_URI;

export const Config: TConfig = { PORT, HOST, MONGO_URI };

export const isCustomHost = HOST !== DefaultConfig.HOST;
