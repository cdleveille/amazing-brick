import path from "node:path";
import express from "express";

import { getAnalytics, getLeaderboard, postRating, postScore } from "@/server/api";
import { Config } from "@/server/config";
import { connectToDatabase } from "@/server/database";

(async () => {
  await connectToDatabase();

  const app = express();

  app.use(express.json());

  app.use(express.static(path.join(process.cwd(), "dist/public")));

  app.post("/api/score", async (req, res) => {
    const { player_id, score: encryptedScore, game_mode_name: encryptedGameModeName } = req.body;
    const scoreRes = await postScore({ player_id, encryptedScore, encryptedGameModeName });
    res.json(scoreRes);
  });

  app.get("/api/leaderboard", async (req, res) => {
    const { player_id } = req.query;
    const leaderboardRes = await getLeaderboard({ player_id: String(player_id) });
    res.json(leaderboardRes);
  });

  app.post("/api/rating", async (req, res) => {
    const { player_id, is_thumbs_up, comments } = req.body;
    const ratingRes = await postRating({ player_id, is_thumbs_up, comments });
    res.json(ratingRes);
  });

  app.get("/api/analytics", async (_req, res) => {
    const analyticsRes = await getAnalytics();
    res.json(analyticsRes);
  });

  app.listen(Config.PORT, () => console.log(`Server listening on http://localhost:${Config.PORT}`));
})();
