import { useEffect } from "react";

import { GAME_MODE_LOCAL_STORAGE_KEY, IS_DARK_MODE_LOCAL_STORAGE_KEY, PLAYER_ID_LOCAL_STORAGE_KEY } from "@constants";
import { useAppContext } from "@hooks";
import { setLocalStorageItem } from "@utils";

export const useSync = () => {
	const { canvas, player_id, game, isPaused, isPausedAtStart, score, screen, isScreen, isDarkMode, gameMode } =
		useAppContext();

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
		setLocalStorageItem(GAME_MODE_LOCAL_STORAGE_KEY, gameMode.name);
	}, [gameMode]);

	useEffect(() => {
		if (!game || isScreen("play")) return;
		game.stopGameLoop = true;
	}, [screen]);
};
