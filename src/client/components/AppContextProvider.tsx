import { ReactNode, useCallback, useMemo, useState } from "react";

import { GAME_MODE_LOCAL_STORAGE_KEY, IS_DARK_MODE_LOCAL_STORAGE_KEY, PLAYER_ID_LOCAL_STORAGE_KEY } from "@constants";
import { AppContext } from "@contexts";
import { Game } from "@game";
import { usePersistedState, useResize } from "@hooks";
import type { TCanvas, TGameModeName, TScreen } from "@types";
import { doesSystemPreferDarkTheme, GAME_MODES, getLocalStorageItem } from "@utils";

type TAppContextProviderProps = {
	children: ReactNode;
};

export const AppContextProvider = ({ children }: TAppContextProviderProps) => {
	const [game, setGame] = useState<Game>();
	const [screen, setScreen] = usePersistedState<TScreen>("home", "screen");
	const [canvas, setCanvas] = usePersistedState<TCanvas | undefined>(undefined, "canvas");
	const [score, setScore] = usePersistedState(0, "score");
	const [isPaused, setIsPaused] = useState(false);
	const [isPausedAtStart, setIsPausedAtStart] = useState(true);
	const [isDarkMode, setIsDarkMode] = useState(
		getLocalStorageItem<boolean>(IS_DARK_MODE_LOCAL_STORAGE_KEY) ?? doesSystemPreferDarkTheme() ?? false
	);
	const [gameMode, setGameMode] = useState(
		GAME_MODES.find(gm => gm.name === getLocalStorageItem<string>(GAME_MODE_LOCAL_STORAGE_KEY)) ?? GAME_MODES[0]
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
