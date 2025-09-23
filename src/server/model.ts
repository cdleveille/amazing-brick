import { model, Schema } from "mongoose";

import type { TBase, TRating, TScore } from "@/shared/types";

const BaseSchema = new Schema<TBase>({
  created_at: {
    type: Date,
    default: () => new Date(),
    immutable: true,
  },
  updated_at: {
    type: Date,
    default: () => new Date(),
  },
});

const ScoreSchema = new Schema<TScore>(
  {
    player_id: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: false,
      default: 0,
    },
    sprint_score: {
      type: Number,
      required: false,
      default: 0,
    },
    shrouded_score: {
      type: Number,
      required: false,
      default: 0,
    },
    gotcha_score: {
      type: Number,
      required: false,
      default: 0,
    },
    last_played_at: {
      type: Date,
      default: () => new Date(),
    },
  },
  { collection: "amazing_brick_score" },
).add(BaseSchema);

export const Score = model<TScore>("User", ScoreSchema);

const RatingSchema = new Schema<TRating>(
  {
    player_id: {
      type: String,
      required: true,
    },
    is_thumbs_up: {
      type: Boolean,
      required: true,
    },
    comments: {
      type: String,
      required: true,
    },
  },
  { collection: "amazing_brick_rating" },
).add(BaseSchema);

export const Rating = model<TRating>("Rating", RatingSchema);
