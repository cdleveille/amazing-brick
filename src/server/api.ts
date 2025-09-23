import CryptoJS from "crypto-js";
import { Elysia } from "elysia";

import { Rating, Score } from "@/server/model";
import { GameMode } from "@/shared/constants";
import { apiSchema } from "@/shared/schema";
import type { TScore } from "@/shared/types";

export const api = new Elysia({ prefix: "/api" })
  .post(
    "/score",
    async c => {
      const { player_id, score: encryptedScore, game_mode_name: encryptedGameModeName } = c.body;

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
    },
    apiSchema.score.post,
  )
  .get(
    "/leaderboard",
    async c => {
      const scores = await Score.find().lean<TScore[]>();

      const { player_id } = c.query;
      const score = scores.find(s => s.player_id === player_id);

      const standardScore = score?.score ?? 0;
      const sprintScore = score?.sprint_score ?? 0;
      const shroudedScore = score?.shrouded_score ?? 0;
      const gotchaScore = score?.gotcha_score ?? 0;

      const standardScores = scores.map(s => s.score).filter(s => s > 0);
      const sprintScores = scores.map(s => s.sprint_score).filter(s => s > 0);
      const shroudedScores = scores.map(s => s.shrouded_score).filter(s => s > 0);
      const gotchaScores = scores.map(s => s.gotcha_score).filter(s => s > 0);

      return {
        playerScore: {
          standardScore,
          standardRank: getRank(standardScore, standardScores),
          standardTop: getTop(standardScore, standardScores),
          sprintScore,
          sprintRank: getRank(sprintScore, sprintScores),
          sprintTop: getTop(sprintScore, sprintScores),
          shroudedScore,
          shroudedRank: getRank(shroudedScore, shroudedScores),
          shroudedTop: getTop(shroudedScore, shroudedScores),
          gotchaScore,
          gotchaRank: getRank(gotchaScore, gotchaScores),
          gotchaTop: getTop(gotchaScore, gotchaScores),
        },
        standardScores: standardScores.sort((a, b) => b - a).slice(0, 10),
        sprintScores: sprintScores.sort((a, b) => b - a).slice(0, 10),
        shroudedScores: shroudedScores.sort((a, b) => b - a).slice(0, 10),
        gotchaScores: gotchaScores.sort((a, b) => b - a).slice(0, 10),
      };
    },
    apiSchema.leaderboard.get,
  )
  .post(
    "/rating",
    async c => {
      const { player_id, is_thumbs_up, comments } = c.body;

      if (!player_id || typeof is_thumbs_up !== "boolean" || typeof comments !== "string") {
        return c.status(422, { message: "Invalid request body" });
      }

      if (
        ![
          "eeba3713-b17d-464c-b4c0-9dd70c92fd99",
          "dd684eb4-3374-4b0c-9cfc-7e52aa9e1270",
          "ab9b0384-c0b7-44d6-b053-ca51ef9d3eb3",
          "6f19bcb7-c795-418f-ba14-8c0d0292cd7f",
        ].includes(player_id)
      ) {
        await Rating.create({ player_id, is_thumbs_up, comments });
      }

      return { message: "Thanks for the feedback!" };
    },
    apiSchema.rating.post,
  );

const getRank = (score: number, scores: number[]) => {
  if (score === 0 || scores.length === 0) return "N/A";
  const sortedScores = [...scores].sort((a, b) => b - a);
  const rankIndex = sortedScores.indexOf(score);
  if (rankIndex === -1) return "N/A";
  const rank = scores.filter(s => s > score).length + 1;
  const tieCount = scores.filter(s => s === score).length - 1;
  return tieCount === 0 ? `${rank}` : `T${rank}`;
};

const getTop = (score: number, scores: number[]) => {
  if (score === 0 || scores.length === 0) return "N/A";
  const numScoresEqualOrAbove = scores.filter(s => s >= score).length;
  const percentileRank = (numScoresEqualOrAbove / scores.length) * 100;
  return `${Math.max(Math.round(percentileRank), 1)}%`;
};
