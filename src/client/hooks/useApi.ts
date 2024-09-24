import { SocketEvent } from "@constants";
import { useSocket } from "@hooks";

import type { SocketEventName, TEncryptedScore, TRating, TScoreRes } from "@types";

const TIMEOUT_MS = 5000;

interface IReqParams<T = unknown> {
	event: SocketEventName;
	data?: unknown;
	callback?: ((res: T) => void) | (() => void);
}

export const useApi = () => {
	const { socket } = useSocket();

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

	const submitScore = (score: TEncryptedScore) => toAndFrom<TScoreRes>({ event: SocketEvent.Score, data: score });

	const submitRating = (rating: TRating) => to({ event: SocketEvent.Rating, data: rating });

	return { submitScore, submitRating };
};
