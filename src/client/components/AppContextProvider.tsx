import { ReactNode, useCallback, useMemo, useState } from "react";

import { GAME_MODE_LOCAL_STORAGE_KEY, IS_DARK_MODE_LOCAL_STORAGE_KEY, PLAYER_ID_LOCAL_STORAGE_KEY } from "@constants";
import { AppContext } from "@contexts";
import { Game } from "@game";
import { useResize } from "@hooks";
import { gameModes, getLocalStorageItem } from "@utils";

import type { TCanvas, TGameMode, TGameModeName, TScreen } from "@types";

type TAppContextProviderProps = {
	children: ReactNode;
};

export const AppContextProvider = ({ children }: TAppContextProviderProps) => {
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
	const [netStartTime, setNetStartTime] = useState(0);

	const player_id = useMemo(
		() => getLocalStorageItem<string>(PLAYER_ID_LOCAL_STORAGE_KEY) ?? crypto.randomUUID(),
		[]
	);

	const isScreen = useCallback((s: TScreen) => screen === s, [screen]);

	const isGameMode = useCallback((gm: TGameModeName) => gameMode.name === gm, [gameMode]);

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
				netStartTime,
				setNetStartTime
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
