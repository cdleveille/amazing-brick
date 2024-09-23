import { Server as HttpServer } from "http";
import { Server } from "socket.io";

import { SocketEvent } from "@constants";
import { log } from "@services";

import type { TScore } from "@types";

export const initSocket = (httpServer: HttpServer) => {
	const io = new Server(httpServer);

	io.on("connect", socket => {
		socket.on(SocketEvent.Score, (score: TScore) => {
			log.info(`Score submitted: ${score.score}`);
			socket.emit(SocketEvent.Score, score.score + 1);
		});
	});
};
