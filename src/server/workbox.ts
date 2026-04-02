import { injectManifest } from "workbox-build";

(async () => {
  const outDir = "dist/public";

  console.log("workbox: injecting build manifest into sw.js...");

  const { count } = await injectManifest({
    globDirectory: outDir,
    globPatterns: ["**/*.*"],
    swSrc: `${outDir}/sw.js`,
    swDest: `${outDir}/sw.js`,
    maximumFileSizeToCacheInBytes: 5000000,
  });

  console.log(`workbox: ${count} URLs were injected into service worker for precaching ✅`);
})();
