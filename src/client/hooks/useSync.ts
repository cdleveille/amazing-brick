import { useEffect } from "react";

import { storage } from "@client/helpers/browser";
import { useAppContext } from "@client/hooks/useAppContext";
import {
	GAME_MODE_LOCAL_STORAGE_KEY,
	IS_DARK_MODE_LOCAL_STORAGE_KEY,
	PLAYER_ID_LOCAL_STORAGE_KEY
} from "@shared/constants";

export const useSync = () => {
	const {
		canvas,
		player_id,
		game,
		isPaused,
		isPausedAtStart,
		score,
		screen,
		isScreen,
		isDarkMode,
		gameMode
	} = useAppContext();

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
		storage.local.setItem(PLAYER_ID_LOCAL_STORAGE_KEY, player_id);
	}, [player_id]);

	useEffect(() => {
		storage.local.setItem(IS_DARK_MODE_LOCAL_STORAGE_KEY, !!isDarkMode);
	}, [isDarkMode]);

	useEffect(() => {
		storage.local.setItem(GAME_MODE_LOCAL_STORAGE_KEY, gameMode.name);
	}, [gameMode]);

	useEffect(() => {
		if (!game || isScreen("play")) return;
		game.stopGameLoop = true;
	}, [screen]);
};
