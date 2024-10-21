import copy from "bun-copy-plugin";
import path from "path";
import { rimrafSync } from "rimraf";

import type { BuildArtifact, BuildConfig, BuildOutput } from "bun";

export const BunBundle = {
	build: async ({
		srcDir,
		outDir,
		entrypoints,
		swEntrypoint,
		jsStringTemplate = "<!-- {js} -->",
		cssStringTemplate = "<!-- {css} -->",
		copyFolders = [],
		copyFiles = [],
		minify,
		plugins = [],
		suppressLog = false,
		clearOutDir = true,
		...rest
	}: BunBundleBuildConfig) => {
		try {
			const start = now();

			if (clearOutDir) rimrafSync(outDir);

			const sharedConfig = {
				root: path.resolve(srcDir),
				outdir: path.resolve(outDir),
				minify
			} as Partial<BuildConfig>;

			const buildMain = Bun.build({
				...rest,
				...sharedConfig,
				entrypoints: [...entrypoints.map(entry => path.join(srcDir, entry))],
				plugins: [
					...plugins,
					...copyFolders.map(folder =>
						copy(`${path.join(srcDir, folder)}/`, `${path.join(outDir, folder)}/`)
					),
					...copyFiles.map(file => copy(path.join(srcDir, file), path.join(outDir, file)))
				]
			});

			// await build results
			const results = swEntrypoint
				? await Promise.all([
						buildMain,
						Bun.build({
							...sharedConfig,
							entrypoints: [path.join(srcDir, swEntrypoint)]
						})
					])
				: await Promise.all([buildMain]);

			// check for errors
			for (const result of results) {
				if (!result.success) throw result.logs;
			}

			// assert that index.html exists in outDir
			const indexHtmlPath = path.join(outDir, "index.html");
			const indexHtmlFile = Bun.file(indexHtmlPath);
			const indexHtmlContents = await indexHtmlFile.text().catch(() => {
				throw "No index.html file found in outDir: " + path.resolve(outDir);
			});

			const { outputs } = results[0];

			const jsFiles = outputs.filter(output => output.type.includes("text/javascript"));
			if (jsFiles.length === 0) throw "No .js files found in build output";
			const jsMarkup = jsFiles
				.map(jsFile => `<script type="text/javascript" src="./${getFileName(jsFile)}" defer></script>`)
				.join("\n");

			const cssFiles = outputs.filter(output => output.type.includes("text/css"));
			const cssMarkup = cssFiles
				.map(cssFile => `<link rel="stylesheet" href="./${getFileName(cssFile)}" />`)
				.join("\n");

			// inject markup for .js and .css files into index.html
			await Bun.write(
				indexHtmlPath,
				indexHtmlContents.replace(jsStringTemplate, jsMarkup).replace(cssStringTemplate, cssMarkup)
			);

			const buildTime = parseFloat((now() - start).toFixed(2));

			if (!suppressLog) console.log(`Build completed in ${buildTime}ms`);

			const buildOutput: BunBundleBuildOutput = {
				results,
				buildTime
			};

			return buildOutput;
		} catch (error) {
			throw new AggregateError(error instanceof Array ? error : [error]);
		}
	}
};

export type BunBundleBuildConfig = {
	srcDir: string;
	outDir: string;
	entrypoints: string[];
	swEntrypoint?: string;
	jsStringTemplate?: string;
	cssStringTemplate?: string;
	copyFolders?: string[];
	copyFiles?: string[];
	suppressLog?: boolean;
	clearOutDir?: boolean;
} & Partial<BuildConfig>;

export type BunBundleBuildOutput = {
	results: BuildOutput[];
	buildTime: number;
};

const now = () => performance?.now?.() ?? Date.now();

const getFileName = (file: BuildArtifact) => path.parse(file.path).base;
