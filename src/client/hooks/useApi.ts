import { useMutation, useQuery } from "@tanstack/react-query";

import { socket } from "@client/helpers/socket";
import { SocketEvent } from "@shared/constants";
import type { TEncryptedScore, TRating } from "@shared/types";

export const useApi = () => {
	const useSubmitScore = (score: TEncryptedScore) =>
		useMutation({
			mutationFn: () => socket.emitAndReceive({ event: SocketEvent.Score, data: [score] })
		});

	const submitRating = (rating: TRating) =>
		socket.emit({ event: SocketEvent.Rating, data: [rating] });

	const getPlayerHighScore = (player_id: string) =>
		useQuery({
			queryKey: ["getPlayerHighScore", player_id],
			queryFn: () =>
				socket.emitAndReceive({
					event: SocketEvent.PlayerHighScore,
					data: [player_id]
				})
		});

	const getHighScores = () =>
		useQuery({
			queryKey: ["getHighScores"],
			queryFn: () => socket.emitAndReceive({ event: SocketEvent.HighScores })
		});

	return { useSubmitScore, submitRating, getPlayerHighScore, getHighScores };
};
