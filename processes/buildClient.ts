import copy from "bun-copy-plugin";
import { rimrafSync } from "rimraf";

import { Env, Path } from "@constants";
import { Config } from "@helpers";
import { log } from "@services";

const now = () => performance?.now?.() ?? Date.now();
const parseArg = (arg: string) => Bun.argv.find(a => a.startsWith(arg))?.split("=")[1];

const env = parseArg("BUN_ENV") ?? parseArg("NODE_ENV");
const isProd = Config.IS_PROD || env === Env.Production;

const src = Path.ClientSrc;
const outdir = Path.Public;

const copyFolders = ["assets"];
const copyFiles = ["favicon.ico", "manifest.json"];

export const buildClient = async () => {
	const start = now();

	rimrafSync(outdir);

	await Bun.build({
		entrypoints: [`${src}/index.html`, `${src}/sw.ts`],
		outdir,
		define: { "Bun.env.IS_PROD": `"${isProd}"`, "Bun.env.WS_PORT": `"${Config.WS_PORT}"` },
		sourcemap: isProd ? "none" : "linked",
		naming: {
			entry: "[dir]/[name].[ext]",
			asset: "[dir]/[name]~[hash].[ext]",
			chunk: "[dir]/chunk~[hash].[ext]"
		},
		plugins: [
			...copyFolders.map(folder => copy(`${src}/${folder}/`, `${outdir}/${folder}/`)),
			...copyFiles.map(file => copy(`${src}/${file}`, `${outdir}/${file}`))
		],
		minify: isProd
	});

	const buildTime = (now() - start).toFixed(2);

	log.info(`Build completed in ${isProd ? Env.Production : Env.Development} mode in ${buildTime}ms`);
};
