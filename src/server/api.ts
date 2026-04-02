import CryptoJS from "crypto-js";

import { Rating, Score } from "@/server/model";
import { GameMode } from "@/shared/constants";
import type { TScore } from "@/shared/types";

export const postScore = async ({
  player_id,
  encryptedScore,
  encryptedGameModeName,
}: {
  player_id: string;
  encryptedScore: string;
  encryptedGameModeName: string;
}) => {
  const score = Number(CryptoJS.AES.decrypt(encryptedScore, player_id).toString(CryptoJS.enc.Utf8));

  const gameModeName = CryptoJS.AES.decrypt(encryptedGameModeName, player_id).toString(
    CryptoJS.enc.Utf8,
  );

  const isValidGameModeName = Object.values(GameMode).includes(gameModeName as GameMode);

  if (!player_id || Number.isNaN(score) || score < 0 || score % 1 !== 0 || !isValidGameModeName) {
    return { highScore: 0, existingHighScore: 0 };
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

  return {
    highScore: Math.max(score, existingHighScoreLookup?.[scoreFieldKey] ?? score),
    existingHighScore: existingHighScoreLookup?.[scoreFieldKey] ?? 0,
  };
};

export const getLeaderboard = async ({ player_id }: { player_id: string }) => {
  const playerScore = await Score.findOne({ player_id }).lean<TScore>();

  const standardScore = playerScore?.score ?? 0;
  const sprintScore = playerScore?.sprint_score ?? 0;
  const shroudedScore = playerScore?.shrouded_score ?? 0;
  const gotchaScore = playerScore?.gotcha_score ?? 0;

  const [result] = await Score.aggregate<ILeaderboardAggResult>([
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

  return {
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
      sprintRank: getRank(sprintScore, stats?.sprintAbove, stats?.sprintEqual, stats?.sprintTotal),
      sprintTop: getTop(sprintScore, stats?.sprintAbove, stats?.sprintEqual, stats?.sprintTotal),
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
      gotchaRank: getRank(gotchaScore, stats?.gotchaAbove, stats?.gotchaEqual, stats?.gotchaTotal),
      gotchaTop: getTop(gotchaScore, stats?.gotchaAbove, stats?.gotchaEqual, stats?.gotchaTotal),
    },
    standardScores: result.standardTop10.map(s => s.score),
    sprintScores: result.sprintTop10.map(s => s.sprint_score),
    shroudedScores: result.shroudedTop10.map(s => s.shrouded_score),
    gotchaScores: result.gotchaTop10.map(s => s.gotcha_score),
  };
};

export const postRating = async ({
  player_id,
  is_thumbs_up,
  comments,
}: {
  player_id: string;
  is_thumbs_up: boolean;
  comments: string;
}) => {
  if (!player_id || typeof is_thumbs_up !== "boolean" || typeof comments !== "string") {
    return { message: "Invalid request body!" };
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

  return { message: "Thanks for the feedback!" };
};

export const getAnalytics = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const playerCount = await Score.countDocuments({
    last_played_at: { $gte: twentyFourHoursAgo },
  });

  return { playerCount };
};

interface ILeaderboardAggResult {
  stats: {
    standardTotal: number;
    standardAbove: number;
    standardEqual: number;
    sprintTotal: number;
    sprintAbove: number;
    sprintEqual: number;
    shroudedTotal: number;
    shroudedAbove: number;
    shroudedEqual: number;
    gotchaTotal: number;
    gotchaAbove: number;
    gotchaEqual: number;
  }[];
  standardTop10: { score: number }[];
  sprintTop10: { sprint_score: number }[];
  shroudedTop10: { shrouded_score: number }[];
  gotchaTop10: { gotcha_score: number }[];
}

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
