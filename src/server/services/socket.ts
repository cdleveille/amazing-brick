import CryptoJS from "crypto-js";
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

import { GameMode, SocketEvent } from "@constants";
import { Rating, Score } from "@models";

import { THighScoresRes } from "../types/index";

import type { TEncryptedScore, TScoreRes, TRating, TGameModeName, TPlayerHighScoreRes, TScore } from "@types";

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
			socket.emit(SocketEvent.PlayerHighScore, {
				standardScore: existingHighScore?.score ?? 0,
				sprintScore: existingHighScore?.sprint_score ?? 0,
				shroudedScore: existingHighScore?.shrouded_score ?? 0,
				gotchaScore: existingHighScore?.gotcha_score ?? 0,
				insanityScore: existingHighScore?.insanity_score ?? 0
			} as TPlayerHighScoreRes);
		});

		socket.on(SocketEvent.HighScores, async () => {
			const highScores = await Score.find();
			socket.emit(SocketEvent.HighScores, assembleHighScoresRes(highScores) as THighScoresRes);
		});
	});
};

const broadcastHighScores = async (socket: Socket) => {
	const highScores = await Score.find();
	socket.broadcast.emit(SocketEvent.NewScore, assembleHighScoresRes(highScores) as THighScoresRes);
};

const assembleHighScoresRes = (highScores: TScore[]) =>
	({
		standardScores: highScores
			.map(({ score }) => score)
			.filter(score => score > 0)
			.sort((a, b) => b - a),
		sprintScores: highScores
			.map(({ sprint_score }) => sprint_score)
			.filter(score => score > 0)
			.sort((a, b) => b - a),
		shroudedScores: highScores
			.map(({ shrouded_score }) => shrouded_score)
			.filter(score => score > 0)
			.sort((a, b) => b - a),
		gotchaScores: highScores
			.map(({ gotcha_score }) => gotcha_score)
			.filter(score => score > 0)
			.sort((a, b) => b - a),
		insanityScores: highScores
			.map(({ insanity_score }) => insanity_score)
			.filter(score => score > 0)
			.sort((a, b) => b - a)
	}) as THighScoresRes;
