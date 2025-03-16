import chokidar from "chokidar";
import path from "path";

import { Path } from "@constants";
import { buildClient } from "@processes";

const SRC_DIR = path.resolve(Path.ClientSrc);

const watcher = chokidar.watch(SRC_DIR, { persistent: true });

const stopWatching = async () => {
	watcher.unwatch(SRC_DIR);
	await watcher.close();
};

process.on("exit", () => stopWatching);
process.on("SIGINT", () => stopWatching);

export const initWatch = (emitReload: () => void) => {
	const buildAndReloadClient = async () => {
		await buildClient();
		emitReload();
	};
	watcher.on("change", buildAndReloadClient);
};
