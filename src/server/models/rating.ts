import { Schema, model } from "mongoose";

import { BaseSchema } from "@server/helpers/util";
import type { TRating } from "@shared/types";

const RatingSchema = new Schema<TRating>(
	{
		player_id: {
			type: String,
			required: true
		},
		is_thumbs_up: {
			type: Boolean,
			required: true
		},
		comments: {
			type: String,
			required: true
		}
	},
	{ collection: "amazing_brick_rating" }
).add(BaseSchema);

export const Rating = model<TRating>("Rating", RatingSchema);
