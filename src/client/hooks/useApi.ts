import { SocketEvent } from "@constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { socket } from "@utils";

import type { SocketEventName, TEncryptedScore, TRating, TScoreRes, THighScoresRes, TPlayerHighScoreRes } from "@types";

const TIMEOUT_MS = 5000;

type IReqParams<T = unknown> = {
	event: SocketEventName;
	data?: unknown;
	callback?: ((res: T) => void) | (() => void);
};

export const useApi = () => {
	const to = ({ event, data, callback }: IReqParams) => {
		socket.emit(event, data);
		callback?.(null);
	};

	const toAndFrom = async <T>({ event, data, callback }: IReqParams<T>) => {
		return new Promise<T>((resolve, reject) => {
			const timeout = setTimeout(() => reject(`Request timed out after ${TIMEOUT_MS}ms.`), TIMEOUT_MS);
			socket.once(event, res => {
				socket.off(event);
				clearTimeout(timeout);
				callback?.(res);
				resolve(res);
			});
			to({ event, data });
		});
	};

	const useSubmitScore = (score: TEncryptedScore) =>
		useMutation({
			mutationFn: () => toAndFrom<TScoreRes>({ event: SocketEvent.Score, data: score })
		});

	const submitRating = (rating: TRating) => to({ event: SocketEvent.Rating, data: rating });

	const getPlayerHighScore = (player_id: string) =>
		useQuery({
			queryKey: ["getPlayerHighScore", player_id],
			queryFn: () => toAndFrom<TPlayerHighScoreRes>({ event: SocketEvent.PlayerHighScore, data: player_id })
		});

	const getHighScores = () =>
		useQuery({
			queryKey: ["getHighScores"],
			queryFn: () => toAndFrom<THighScoresRes>({ event: SocketEvent.HighScores })
		});

	return { useSubmitScore, submitRating, getPlayerHighScore, getHighScores };
};
