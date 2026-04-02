import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import { getAnalytics, getLeaderboard, postRating, postScore } from "@/server/api";
import { Config } from "@/server/config";
import { connectToDatabase } from "@/server/database";

const app = new Hono();

app.use("/*", serveStatic({ root: "dist/public" }));

app.post("/api/score", async c => {
  const {
    player_id,
    score: encryptedScore,
    game_mode_name: encryptedGameModeName,
  } = await c.req.json();
  const scoreRes = await postScore({ player_id, encryptedScore, encryptedGameModeName });
  return c.json(scoreRes);
});

app.get("/api/leaderboard", async c => {
  const { player_id } = c.req.query();
  const leaderboardRes = await getLeaderboard({ player_id: String(player_id) });
  return c.json(leaderboardRes);
});

app.post("/api/rating", async c => {
  const { player_id, is_thumbs_up, comments } = await c.req.json();
  const ratingRes = await postRating({ player_id, is_thumbs_up, comments });
  return c.json(ratingRes);
});

app.get("/api/analytics", async c => {
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

export type TApi = typeof app;
