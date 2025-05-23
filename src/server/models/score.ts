import { Schema, model } from "mongoose";

import { BaseSchema } from "@server/helpers/util";
import type { TScore } from "@shared/types";

const ScoreSchema = new Schema<TScore>(
	{
		player_id: {
			type: String,
			required: true
		},
		score: {
			type: Number,
			required: false,
			default: 0
		},
		sprint_score: {
			type: Number,
			required: false,
			default: 0
		},
		shrouded_score: {
			type: Number,
			required: false,
			default: 0
		},
		gotcha_score: {
			type: Number,
			required: false,
			default: 0
		}
	},
	{ collection: "amazing_brick_score" }
).add(BaseSchema);

export const Score = model<TScore>("User", ScoreSchema);
