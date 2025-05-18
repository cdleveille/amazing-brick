import { type ReactNode, useCallback, useMemo, useState } from "react";

import { AppContext } from "@client/contexts/app";
import type { Game } from "@client/game/game";
import { doesSystemPreferDarkTheme, storage } from "@client/helpers/browser";
import { GAME_MODES } from "@client/helpers/game";
import { usePersistedState } from "@client/hooks/usePersistedState";
import { useResize } from "@client/hooks/useResize";
import {
	GAME_MODE_LOCAL_STORAGE_KEY,
	IS_DARK_MODE_LOCAL_STORAGE_KEY,
	PLAYER_ID_LOCAL_STORAGE_KEY
} from "@shared/constants";
import type { TCanvas, TGameModeName, TScreen } from "@shared/types";

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
		storage.local.getItem<boolean>(IS_DARK_MODE_LOCAL_STORAGE_KEY) ??
			doesSystemPreferDarkTheme() ??
			false
	);
	const [gameMode, setGameMode] = useState(
		GAME_MODES.find(
			gm => gm.name === storage.local.getItem<string>(GAME_MODE_LOCAL_STORAGE_KEY)
		) ?? GAME_MODES[0]
	);
	const [netStartTime, setNetStartTime] = useState(0);

	const player_id = useMemo(
		() => storage.local.getItem<string>(PLAYER_ID_LOCAL_STORAGE_KEY) ?? crypto.randomUUID(),
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
