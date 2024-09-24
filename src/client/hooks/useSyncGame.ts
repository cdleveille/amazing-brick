import { useEffect } from "react";

import { PLAYER_ID_LOCAL_STORAGE_KEY } from "@constants";
import { useAppContext, useLocalStorage } from "@hooks";

export const useSyncGame = () => {
	const ctx = useAppContext();
	const { canvas, player_id, game, isPaused, isPausedAtStart, score, screen } = ctx;

	const { setLocalStorageItem } = useLocalStorage();

	useEffect(() => {
		if (!game) return;
		game.resize(canvas);
	}, [canvas]);

	useEffect(() => {
		if (!game) return;
		game.isPaused = isPaused;
	}, [isPaused]);

	useEffect(() => {
		if (!game) return;
		game.isPausedAtStart = isPausedAtStart;
	}, [isPausedAtStart]);

	useEffect(() => {
		if (!game) return;
		game.score = score;
	}, [score]);

	useEffect(() => {
		if (!player_id) return;
		setLocalStorageItem(PLAYER_ID_LOCAL_STORAGE_KEY, ctx.player_id);
	}, [player_id]);

	useEffect(() => {
		if (!game || screen === "play") return;
		game.stopGameLoop = true;
	}, [screen]);
};
