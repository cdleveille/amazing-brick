import { Server as HttpServer } from "http";
import { Server } from "socket.io";

import { SocketEvent } from "@constants";
import { Score } from "@models";

import type { TScore } from "@types";

export const initSocket = (httpServer: HttpServer) => {
	const io = new Server(httpServer);

	io.on("connect", socket => {
		socket.on(SocketEvent.Score, async ({ player_id, score }: TScore) => {
			if (!player_id || isNaN(score) || score < 0 || score % 1 !== 0) {
				socket.emit(SocketEvent.Score, 0);
				return;
			}
			const existingHighScore = await Score.findOne({ player_id });
			if (score > 0) {
				if (!existingHighScore) {
					await Score.create({ player_id, score });
				} else if (score > existingHighScore.score) {
					await Score.updateOne({ player_id }, { score, updated_at: new Date() });
				}
			}
			socket.emit(SocketEvent.Score, Math.max(score, existingHighScore?.score ?? score));
		});
	});
};
