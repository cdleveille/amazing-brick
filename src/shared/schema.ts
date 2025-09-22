import { type StandaloneInputSchema, t } from "elysia";

export const encryptedScoreSchema = t.Object({
  player_id: t.String(),
  score: t.String(),
  game_mode_name: t.String(),
});

export const scoreResSchema = t.Object({
  highScore: t.Number(),
  existingHighScore: t.Number(),
});

export const leaderboardResSchema = t.Object({
  playerScore: t.Object({
    standardScore: t.Number(),
    standardRank: t.String(),
    standardTop: t.String(),
    sprintScore: t.Number(),
    sprintRank: t.String(),
    sprintTop: t.String(),
    shroudedScore: t.Number(),
    shroudedRank: t.String(),
    shroudedTop: t.String(),
    gotchaScore: t.Number(),
    gotchaRank: t.String(),
    gotchaTop: t.String(),
  }),
  standardScores: t.Array(t.Number()),
  sprintScores: t.Array(t.Number()),
  shroudedScores: t.Array(t.Number()),
  gotchaScores: t.Array(t.Number()),
});

export const ratingSchema = t.Object({
  player_id: t.String(),
  is_thumbs_up: t.Boolean(),
  comments: t.String(),
});

export const apiSchema = {
  score: {
    post: {
      body: encryptedScoreSchema,
      response: {
        200: scoreResSchema,
        422: t.Object({ message: t.String() }),
        500: t.Object({ message: t.String() }),
      },
    },
  },
  leaderboard: {
    get: {
      query: t.Object({ player_id: t.String() }),
      response: {
        200: leaderboardResSchema,
        500: t.Object({ message: t.String() }),
      },
    },
  },
  rating: {
    post: {
      body: ratingSchema,
      response: {
        200: t.Object({ message: t.String() }),
        422: t.Object({ message: t.String() }),
        500: t.Object({ message: t.String() }),
      },
    },
  },
} satisfies Record<string, Record<string, StandaloneInputSchema>>;
