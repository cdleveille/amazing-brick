import CryptoJS from "crypto-js";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";

import { SocketEvent } from "@constants";
import { Rating, Score } from "@models";

import type { TEncryptedScore, TScoreRes, TRating } from "@types";

export const initSocket = (httpServer: HttpServer) => {
	const io = new Server(httpServer);

	io.on("connect", socket => {
		socket.on(SocketEvent.Score, async ({ player_id, score: encryptedScore }: TEncryptedScore) => {
			const score = parseInt(CryptoJS.AES.decrypt(encryptedScore, socket.id).toString(CryptoJS.enc.Utf8));
			if (!player_id || isNaN(score) || score < 0 || score % 1 !== 0) {
				socket.emit(SocketEvent.Score, 0);
				return;
			}
			const existingHighScore = await Score.findOne({ player_id });
			if (score > 0) {
				if (!existingHighScore) {
					await Score.create({ player_id, score });
					const highScores = await Score.find().sort({ score: -1 });
					socket.broadcast.emit(
						SocketEvent.NewScore,
						highScores.map(({ score }) => score)
					);
				} else if (score > existingHighScore.score) {
					await Score.updateOne({ player_id }, { score, updated_at: new Date() });
					const highScores = await Score.find().sort({ score: -1 });
					socket.broadcast.emit(
						SocketEvent.NewScore,
						highScores.map(({ score }) => score)
					);
				}
			}
			socket.emit(SocketEvent.Score, {
				highScore: Math.max(score, existingHighScore?.score ?? score),
				existingHighScore: existingHighScore?.score ?? 0
			} as TScoreRes);
		});

		socket.on(SocketEvent.Rating, async ({ player_id, is_thumbs_up, comments }: TRating) => {
			if (!player_id || typeof is_thumbs_up !== "boolean" || typeof comments !== "string") return;
			await Rating.create({ player_id, is_thumbs_up, comments });
		});

		socket.on(SocketEvent.PlayerHighScore, async (player_id: string) => {
			const existingHighScore = await Score.findOne({ player_id });
			socket.emit(SocketEvent.PlayerHighScore, existingHighScore?.score ?? 0);
		});

		socket.on(SocketEvent.HighScores, async () => {
			const highScores = await Score.find().sort({ score: -1 });
			socket.emit(
				SocketEvent.HighScores,
				highScores.map(({ score }) => score)
			);
		});
	});
};
