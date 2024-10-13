import { useMemo, useState } from "react";

import { Screen } from "@components";
import { GAME_MODE_LOCAL_STORAGE_KEY, IS_DARK_MODE_LOCAL_STORAGE_KEY, PLAYER_ID_LOCAL_STORAGE_KEY } from "@constants";
import { AppContext } from "@contexts";
import { Game } from "@game";
import { useLocalStorage, useResize } from "@hooks";
import { gameModes } from "@utils";

import type { TCanvas, TGameMode, TGameModeName, TScreen } from "@types";

export const Main = () => {
	const { getLocalStorageItem } = useLocalStorage();

	const [game, setGame] = useState<Game>();
	const [screen, setScreen] = useState<TScreen>("home");
	const [canvas, setCanvas] = useState<TCanvas>();
	const [score, setScore] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isPausedAtStart, setIsPausedAtStart] = useState(true);
	const [isDarkMode, setIsDarkMode] = useState(getLocalStorageItem<boolean>(IS_DARK_MODE_LOCAL_STORAGE_KEY) ?? false);
	const [gameMode, setGameMode] = useState(
		getLocalStorageItem<TGameMode>(GAME_MODE_LOCAL_STORAGE_KEY) ?? gameModes[0]
	);
	const [startTime, setStartTime] = useState(0);
	const [netStartTime, setNetStartTime] = useState(0);

	const player_id = useMemo(
		() => getLocalStorageItem<string>(PLAYER_ID_LOCAL_STORAGE_KEY) ?? crypto.randomUUID(),
		[]
	);

	const isScreen = (s: TScreen) => screen === s;

	const isGameMode = (gm: TGameModeName) => gameMode.name === gm;

	useResize(setCanvas);

	if (!canvas) return null;

	return (
		<AppContext.Provider
			value={{
				game,
				setGame,
				screen,
				setScreen,
				isScreen,
				canvas,
				score,
				setScore,
				isPaused,
				setIsPaused,
				isPausedAtStart,
				setIsPausedAtStart,
				player_id,
				isDarkMode,
				setIsDarkMode,
				gameMode,
				setGameMode,
				isGameMode,
				startTime,
				setStartTime,
				netStartTime,
				setNetStartTime
			}}
		>
			<Screen />
		</AppContext.Provider>
	);
};
