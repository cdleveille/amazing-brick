import { Env } from "@/shared/constants";

export const Config = {
  IS_PROD: process.env.MODE === Env.Production,
  PORT: Number(process.env.PORT ?? window.location.port),
};
