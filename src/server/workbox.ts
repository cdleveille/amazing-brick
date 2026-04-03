import { injectManifest } from "workbox-build";

const outDir = "dist/public";

console.log("workbox: injecting build manifest into sw.js...");

injectManifest({
  globDirectory: outDir,
  globPatterns: ["**/*.*"],
  swSrc: `${outDir}/sw.js`,
  swDest: `${outDir}/sw.js`,
  maximumFileSizeToCacheInBytes: 5000000,
}).then(({ count }) =>
  console.log(`workbox: ${count} URLs were injected into service worker for precaching ✅`),
);
