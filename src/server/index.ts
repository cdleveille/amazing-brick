import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import { api } from "@/server/api";
import { Config } from "@/server/config";
import { connectToDatabase } from "@/server/database";

const app = new Hono();

app.route("/api", api);

app.use("/*", serveStatic({ root: "dist/public" }));

connectToDatabase().then(() => {
  serve(
    {
      fetch: app.fetch,
      port: Config.PORT,
    },
    server => console.log(`Amazing Brick server is listening on http://localhost:${server.port}`),
  );
});
