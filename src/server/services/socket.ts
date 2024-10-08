import CryptoJS from "crypto-js";
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

import { GameMode, SocketEvent } from "@constants";
import { Rating, Score } from "@models";

import type { TEncryptedScore, TScoreRes, TRating, TGameModeName } from "@types";

export const initSocket = (httpServer: HttpServer) => {
	const io = new Server(httpServer);

	io.on("connect", socket => {
		socket.on(
			SocketEvent.Score,
			async ({ player_id, score: encryptedScore, game_mode_name: encryptedGameModeName }: TEncryptedScore) => {
				const score = parseInt(CryptoJS.AES.decrypt(encryptedScore, socket.id).toString(CryptoJS.enc.Utf8));
				const gameModeName = CryptoJS.AES.decrypt(encryptedGameModeName, socket.id).toString(
					CryptoJS.enc.Utf8
				) as TGameModeName;

				const isValidGameModeName = Object.values(GameMode).includes(gameModeName);

				if (!player_id || isNaN(score) || score < 0 || score % 1 !== 0 || !isValidGameModeName) {
					socket.emit(SocketEvent.Score, { highScore: 0, existingHighScore: 0 } as TScoreRes);
					return;
				}

				const existingHighScore = await Score.findOne({ player_id });
				const existingHighScoreLookup = existingHighScore as unknown as Record<string, number>;

				const scoreFieldKey =
					gameModeName === GameMode.Standard ? "score" : `${gameModeName.toLowerCase()}_score`;

				if (score > 0) {
					if (!existingHighScore) {
						await Score.create({ player_id, [scoreFieldKey]: score });
						broadcastHighScores(socket);
					} else if (score > existingHighScoreLookup[scoreFieldKey]) {
						await Score.updateOne({ player_id }, { [scoreFieldKey]: score, updated_at: new Date() });
						broadcastHighScores(socket);
					}
				}

				socket.emit(SocketEvent.Score, {
					highScore: Math.max(score, existingHighScoreLookup?.[scoreFieldKey] ?? score),
					existingHighScore: existingHighScoreLookup?.[scoreFieldKey] ?? 0
				} as TScoreRes);
			}
		);

		socket.on(SocketEvent.Rating, async ({ player_id, is_thumbs_up, comments }: TRating) => {
			if (!player_id || typeof is_thumbs_up !== "boolean" || typeof comments !== "string") return;
			await Rating.create({ player_id, is_thumbs_up, comments });
		});

		socket.on(SocketEvent.PlayerHighScore, async (player_id: string) => {
			const existingHighScore = await Score.findOne({ player_id });
			socket.emit(SocketEvent.PlayerHighScore, existingHighScore?.score ?? 0);
		});

		socket.on(SocketEvent.HighScores, async () => {
			const highScores = await Score.find();
			socket.emit(
				SocketEvent.HighScores,
				highScores.map(({ score }) => score)
			);
		});
	});
};

const broadcastHighScores = async (socket: Socket) => {
	const highScores = await Score.find();
	socket.broadcast.emit(
		SocketEvent.NewScore,
		highScores.map(({ score }) => score)
	);
};
