import { zValidator } from "@hono/zod-validator";
import CryptoJS from "crypto-js";
import { Hono } from "hono";
import { z } from "zod";

import { Rating, Score } from "@/server/model";
import { GameMode } from "@/shared/constants";
import type { TLeaderboardAggResult, TScore } from "@/shared/types";

export const api = new Hono()
  .post(
    "/score",
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
      } = c.req.valid("json");

      const score = Number(
        CryptoJS.AES.decrypt(encryptedScore, player_id).toString(CryptoJS.enc.Utf8),
      );

      const gameModeName = CryptoJS.AES.decrypt(encryptedGameModeName, player_id).toString(
        CryptoJS.enc.Utf8,
      );

      const isValidGameModeName = Object.values(GameMode).includes(gameModeName as GameMode);

      if (
        !player_id ||
        Number.isNaN(score) ||
        score < 0 ||
        score % 1 !== 0 ||
        !isValidGameModeName
      ) {
        return c.json({ highScore: 0, existingHighScore: 0 });
      }

      const existingHighScore = await Score.findOne({ player_id });
      const existingHighScoreLookup = existingHighScore as unknown as Record<string, number>;

      const scoreFieldKey =
        gameModeName === GameMode.Standard ? "score" : `${gameModeName.toLowerCase()}_score`;

      if (score > 0) {
        const date = new Date();
        if (!existingHighScore) {
          await Score.create({ player_id, [scoreFieldKey]: score });
        } else if (score > existingHighScoreLookup[scoreFieldKey]) {
          await Score.updateOne(
            { player_id },
            { [scoreFieldKey]: score, updated_at: date, last_played_at: date },
          );
        } else {
          await Score.updateOne({ player_id }, { last_played_at: date });
        }
      }

      return c.json({
        highScore: Math.max(score, existingHighScoreLookup?.[scoreFieldKey] ?? score),
        existingHighScore: existingHighScoreLookup?.[scoreFieldKey] ?? 0,
      });
    },
  )
  .get(
    "/leaderboard",
    zValidator(
      "query",
      z.object({
        player_id: z.string(),
      }),
    ),
    async c => {
      const { player_id } = c.req.valid("query");

      const playerScore = await Score.findOne({ player_id }).lean<TScore>();

      const standardScore = playerScore?.score ?? 0;
      const sprintScore = playerScore?.sprint_score ?? 0;
      const shroudedScore = playerScore?.shrouded_score ?? 0;
      const gotchaScore = playerScore?.gotcha_score ?? 0;

      const [result] = await Score.aggregate<TLeaderboardAggResult>([
        {
          $facet: {
            stats: [
              {
                $group: {
                  _id: null,
                  standardTotal: { $sum: { $cond: [{ $gt: ["$score", 0] }, 1, 0] } },
                  standardAbove: { $sum: { $cond: [{ $gt: ["$score", standardScore] }, 1, 0] } },
                  standardEqual: { $sum: { $cond: [{ $eq: ["$score", standardScore] }, 1, 0] } },
                  sprintTotal: { $sum: { $cond: [{ $gt: ["$sprint_score", 0] }, 1, 0] } },
                  sprintAbove: { $sum: { $cond: [{ $gt: ["$sprint_score", sprintScore] }, 1, 0] } },
                  sprintEqual: { $sum: { $cond: [{ $eq: ["$sprint_score", sprintScore] }, 1, 0] } },
                  shroudedTotal: { $sum: { $cond: [{ $gt: ["$shrouded_score", 0] }, 1, 0] } },
                  shroudedAbove: {
                    $sum: { $cond: [{ $gt: ["$shrouded_score", shroudedScore] }, 1, 0] },
                  },
                  shroudedEqual: {
                    $sum: { $cond: [{ $eq: ["$shrouded_score", shroudedScore] }, 1, 0] },
                  },
                  gotchaTotal: { $sum: { $cond: [{ $gt: ["$gotcha_score", 0] }, 1, 0] } },
                  gotchaAbove: {
                    $sum: { $cond: [{ $gt: ["$gotcha_score", gotchaScore] }, 1, 0] },
                  },
                  gotchaEqual: {
                    $sum: { $cond: [{ $eq: ["$gotcha_score", gotchaScore] }, 1, 0] },
                  },
                },
              },
            ],
            standardTop10: [
              { $match: { score: { $gt: 0 } } },
              { $sort: { score: -1 } },
              { $limit: 10 },
              { $project: { _id: 0, score: 1 } },
            ],
            sprintTop10: [
              { $match: { sprint_score: { $gt: 0 } } },
              { $sort: { sprint_score: -1 } },
              { $limit: 10 },
              { $project: { _id: 0, sprint_score: 1 } },
            ],
            shroudedTop10: [
              { $match: { shrouded_score: { $gt: 0 } } },
              { $sort: { shrouded_score: -1 } },
              { $limit: 10 },
              { $project: { _id: 0, shrouded_score: 1 } },
            ],
            gotchaTop10: [
              { $match: { gotcha_score: { $gt: 0 } } },
              { $sort: { gotcha_score: -1 } },
              { $limit: 10 },
              { $project: { _id: 0, gotcha_score: 1 } },
            ],
          },
        },
      ]);

      const stats = result.stats[0];

      return c.json({
        playerScore: {
          standardScore,
          standardRank: getRank(
            standardScore,
            stats?.standardAbove,
            stats?.standardEqual,
            stats?.standardTotal,
          ),
          standardTop: getTop(
            standardScore,
            stats?.standardAbove,
            stats?.standardEqual,
            stats?.standardTotal,
          ),
          sprintScore,
          sprintRank: getRank(
            sprintScore,
            stats?.sprintAbove,
            stats?.sprintEqual,
            stats?.sprintTotal,
          ),
          sprintTop: getTop(
            sprintScore,
            stats?.sprintAbove,
            stats?.sprintEqual,
            stats?.sprintTotal,
          ),
          shroudedScore,
          shroudedRank: getRank(
            shroudedScore,
            stats?.shroudedAbove,
            stats?.shroudedEqual,
            stats?.shroudedTotal,
          ),
          shroudedTop: getTop(
            shroudedScore,
            stats?.shroudedAbove,
            stats?.shroudedEqual,
            stats?.shroudedTotal,
          ),
          gotchaScore,
          gotchaRank: getRank(
            gotchaScore,
            stats?.gotchaAbove,
            stats?.gotchaEqual,
            stats?.gotchaTotal,
          ),
          gotchaTop: getTop(
            gotchaScore,
            stats?.gotchaAbove,
            stats?.gotchaEqual,
            stats?.gotchaTotal,
          ),
        },
        standardScores: result.standardTop10.map(s => s.score),
        sprintScores: result.sprintTop10.map(s => s.sprint_score),
        shroudedScores: result.shroudedTop10.map(s => s.shrouded_score),
        gotchaScores: result.gotchaTop10.map(s => s.gotcha_score),
      });
    },
  )
  .post(
    "/rating",
    zValidator(
      "json",
      z.object({
        player_id: z.string(),
        is_thumbs_up: z.boolean(),
        comments: z.string(),
      }),
    ),
    async c => {
      const { player_id, is_thumbs_up, comments } = c.req.valid("json");

      if (!player_id || typeof is_thumbs_up !== "boolean" || typeof comments !== "string") {
        return c.json({ message: "Invalid request body!" }, 400);
      }

      if (
        ![
          "eeba3713-b17d-464c-b4c0-9dd70c92fd99",
          "dd684eb4-3374-4b0c-9cfc-7e52aa9e1270",
          "ab9b0384-c0b7-44d6-b053-ca51ef9d3eb3",
          "6f19bcb7-c795-418f-ba14-8c0d0292cd7f",
          "31f3eeda-e498-4edd-a714-2cb084e34865",
        ].includes(player_id)
      ) {
        await Rating.create({ player_id, is_thumbs_up, comments });
      }

      return c.json({ message: "Thanks for the feedback!" });
    },
  )
  .get("/analytics", async c => {
    const now = Date.now();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [scoreAgg, ratingAgg] = await Promise.all([
      Score.aggregate([
        {
          $facet: {
            globalStats: [
              {
                $group: {
                  _id: null,
                  totalPlayers: { $sum: 1 },
                  avgStandard: {
                    $avg: { $cond: [{ $gt: ["$score", 0] }, "$score", null] },
                  },
                  maxStandard: { $max: "$score" },
                  standardOver10: { $sum: { $cond: [{ $gt: ["$score", 10] }, 1, 0] } },
                  standardOver50: { $sum: { $cond: [{ $gt: ["$score", 50] }, 1, 0] } },
                  standardOver100: { $sum: { $cond: [{ $gt: ["$score", 100] }, 1, 0] } },
                  avgSprint: {
                    $avg: { $cond: [{ $gt: ["$sprint_score", 0] }, "$sprint_score", null] },
                  },
                  maxSprint: { $max: "$sprint_score" },
                  sprintOver10: { $sum: { $cond: [{ $gt: ["$sprint_score", 10] }, 1, 0] } },
                  sprintOver50: { $sum: { $cond: [{ $gt: ["$sprint_score", 50] }, 1, 0] } },
                  sprintOver100: { $sum: { $cond: [{ $gt: ["$sprint_score", 100] }, 1, 0] } },
                  avgShrouded: {
                    $avg: { $cond: [{ $gt: ["$shrouded_score", 0] }, "$shrouded_score", null] },
                  },
                  maxShrouded: { $max: "$shrouded_score" },
                  shroudedOver10: { $sum: { $cond: [{ $gt: ["$shrouded_score", 10] }, 1, 0] } },
                  shroudedOver50: { $sum: { $cond: [{ $gt: ["$shrouded_score", 50] }, 1, 0] } },
                  shroudedOver100: { $sum: { $cond: [{ $gt: ["$shrouded_score", 100] }, 1, 0] } },
                  avgGotcha: {
                    $avg: { $cond: [{ $gt: ["$gotcha_score", 0] }, "$gotcha_score", null] },
                  },
                  maxGotcha: { $max: "$gotcha_score" },
                  gotchaOver10: { $sum: { $cond: [{ $gt: ["$gotcha_score", 10] }, 1, 0] } },
                  gotchaOver50: { $sum: { $cond: [{ $gt: ["$gotcha_score", 50] }, 1, 0] } },
                  gotchaOver100: { $sum: { $cond: [{ $gt: ["$gotcha_score", 100] }, 1, 0] } },
                },
              },
            ],
            activePlayers24h: [
              { $match: { last_played_at: { $gte: twentyFourHoursAgo } } },
              { $count: "count" },
            ],
            newPlayers24h: [
              { $match: { created_at: { $gte: twentyFourHoursAgo } } },
              { $count: "count" },
            ],
            activePlayers7d: [
              { $match: { last_played_at: { $gte: sevenDaysAgo } } },
              { $count: "count" },
            ],
            activePlayers30d: [
              { $match: { last_played_at: { $gte: thirtyDaysAgo } } },
              { $count: "count" },
            ],
          },
        },
      ]),
      Rating.aggregate([
        {
          $facet: {
            thumbsStats: [{ $group: { _id: "$is_thumbs_up", count: { $sum: 1 } } }],
            recentRatings24h: [
              { $match: { created_at: { $gte: twentyFourHoursAgo } } },
              { $count: "count" },
            ],
            withComments: [{ $match: { comments: { $ne: "" } } }, { $count: "count" }],
          },
        },
      ]),
    ]);

    const gs = scoreAgg[0]?.globalStats[0] ?? {};
    const active24h: number = scoreAgg[0]?.activePlayers24h[0]?.count ?? 0;
    const newPlayers: number = scoreAgg[0]?.newPlayers24h[0]?.count ?? 0;
    const active7d: number = scoreAgg[0]?.activePlayers7d[0]?.count ?? 0;
    const active30d: number = scoreAgg[0]?.activePlayers30d[0]?.count ?? 0;

    const thumbsStats: { _id: boolean; count: number }[] = ratingAgg[0]?.thumbsStats ?? [];
    const thumbsUp = thumbsStats.find(t => t._id === true)?.count ?? 0;
    const thumbsDown = thumbsStats.find(t => t._id === false)?.count ?? 0;
    const totalRatings = thumbsUp + thumbsDown;
    const recentRatings: number = ratingAgg[0]?.recentRatings24h[0]?.count ?? 0;
    const ratingsWithComments: number = ratingAgg[0]?.withComments[0]?.count ?? 0;

    const round1 = (n: number | null | undefined) => (n != null ? Math.round(n * 10) / 10 : null);

    return c.json({
      players: {
        total: gs.totalPlayers ?? 0,
        active24h,
        newPlayers24h: newPlayers,
        returningPlayers24h: active24h - newPlayers,
        active7d,
        active30d,
      },
      scores: {
        standard: {
          avg: round1(gs.avgStandard),
          max: gs.maxStandard ?? 0,
          over10: gs.standardOver10 ?? 0,
          over50: gs.standardOver50 ?? 0,
          over100: gs.standardOver100 ?? 0,
        },
        sprint: {
          avg: round1(gs.avgSprint),
          max: gs.maxSprint ?? 0,
          over10: gs.sprintOver10 ?? 0,
          over50: gs.sprintOver50 ?? 0,
          over100: gs.sprintOver100 ?? 0,
        },
        shrouded: {
          avg: round1(gs.avgShrouded),
          max: gs.maxShrouded ?? 0,
          over10: gs.shroudedOver10 ?? 0,
          over50: gs.shroudedOver50 ?? 0,
          over100: gs.shroudedOver100 ?? 0,
        },
        gotcha: {
          avg: round1(gs.avgGotcha),
          max: gs.maxGotcha ?? 0,
          over10: gs.gotchaOver10 ?? 0,
          over50: gs.gotchaOver50 ?? 0,
          over100: gs.gotchaOver100 ?? 0,
        },
      },
      ratings: {
        thumbsUp,
        thumbsDown,
        total: totalRatings,
        thumbsUpRatio: totalRatings > 0 ? Math.round((thumbsUp / totalRatings) * 100) : null,
        recent24h: recentRatings,
        withComments: ratingsWithComments,
      },
    });
  });

export type TApi = typeof api;

const getRank = (score: number, above = 0, equal = 0, total = 0) => {
  if (score === 0 || total === 0) return "N/A";
  const rank = above + 1;
  const tieCount = equal - 1;
  return tieCount === 0 ? `${rank}` : `T${rank}`;
};

const getTop = (score: number, above = 0, equal = 0, total = 0) => {
  if (score === 0 || total === 0) return "N/A";
  const percentileRank = ((above + equal) / total) * 100;
  return `${Math.max(Math.round(percentileRank), 1)}%`;
};
