import { useEffect } from "react";

import { IS_DARK_MODE_LOCAL_STORAGE_KEY, PLAYER_ID_LOCAL_STORAGE_KEY } from "@constants";
import { useAppContext, useLocalStorage } from "@hooks";

export const useSyncGame = () => {
	const { canvas, player_id, game, isPaused, isPausedAtStart, score, screen, isDarkMode } = useAppContext();

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
		setLocalStorageItem(PLAYER_ID_LOCAL_STORAGE_KEY, player_id);
	}, [player_id]);

	useEffect(() => {
		setLocalStorageItem(IS_DARK_MODE_LOCAL_STORAGE_KEY, !!isDarkMode);
	}, [isDarkMode]);

	useEffect(() => {
		if (!game || screen === "play") return;
		game.stopGameLoop = true;
	}, [screen]);
};
