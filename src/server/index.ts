import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { getAnalytics, getLeaderboard, postRating, postScore } from "@/server/api";
import { Config } from "@/server/config";
import { connectToDatabase } from "@/server/database";

const app = new Hono();

app.use("/*", serveStatic({ root: "dist/public" }));

const routes = app
  .post(
    "/api/score",
    zValidator(
      "json",
      z.object({
        player_id: z.string(),
        score: z.string(),
        game_mode_name: z.string(),
      }),
    ),
    async c => {
      const {
        player_id,
        score: encryptedScore,
        game_mode_name: encryptedGameModeName,
      } = await c.req.json();
      const scoreRes = await postScore({ player_id, encryptedScore, encryptedGameModeName });
      return c.json(scoreRes);
    },
  )
  .get(
    "/api/leaderboard",
    zValidator(
      "query",
      z.object({
        player_id: z.string(),
      }),
    ),
    async c => {
      const { player_id } = c.req.query();
      const leaderboardRes = await getLeaderboard({ player_id: String(player_id) });
      return c.json(leaderboardRes);
    },
  )
  .post(
    "/api/rating",
    zValidator(
      "json",
      z.object({
        player_id: z.string(),
        is_thumbs_up: z.boolean(),
        comments: z.string(),
      }),
    ),
    async c => {
      const { player_id, is_thumbs_up, comments } = await c.req.json();
      const ratingRes = await postRating({ player_id, is_thumbs_up, comments });
      return c.json(ratingRes);
    },
  )
  .get("/api/analytics", async c => {
    const analyticsRes = await getAnalytics();
    return c.json(analyticsRes);
  });

const startServer = async () => {
  try {
    await connectToDatabase();

    serve(
      {
        fetch: app.fetch,
        port: Config.PORT,
      },
      info => {
        console.log(`🚀 Server is listening on http://localhost:${info.port}`);
      },
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export type TApi = typeof routes;
