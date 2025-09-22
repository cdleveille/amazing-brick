import { existsSync } from "node:fs";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";

import { Path } from "@/shared/constants";

export const plugins = new Elysia().use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        baseUri: ["'self'"],
        childSrc: ["'self'"],
        connectSrc: ["'self'"],
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
        workerSrc: ["'self'"],
      },
    },
  }),
);

if (existsSync(Path.Public)) {
  const serveStatic = new Elysia()
    .use(html())
    .use(
      staticPlugin({
        prefix: "/",
        assets: Path.Public,
        noCache: true,
      }),
    )
    // SPA index.html fallback to enable client-side routing
    .get("*", ({ path }) => {
      const url = path.split("/").pop();
      if (url && !url.includes(".")) return Bun.file(`${Path.Public}/index.html`);
    });
  plugins.use(serveStatic);
}
