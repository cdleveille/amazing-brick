import { useMemo, useState } from "react";

import { Screen } from "@components";
import {
	Color,
	GAME_MODE_LOCAL_STORAGE_KEY,
	IS_DARK_MODE_LOCAL_STORAGE_KEY,
	PLAYER_ID_LOCAL_STORAGE_KEY
} from "@constants";
import { Game, gameModes } from "@game";
import { AppContext, useLocalStorage, useResize } from "@hooks";

import type { TCanvas, TGameMode, TScreen } from "@types";

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

	const player_id = useMemo(
		() => getLocalStorageItem<string>(PLAYER_ID_LOCAL_STORAGE_KEY) ?? crypto.randomUUID(),
		[]
	);

	useResize(setCanvas);

	if (!canvas) return null;

	return (
		<AppContext.Provider
			value={{
				game,
				setGame,
				screen,
				setScreen,
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
				setGameMode
			}}
		>
			<div
				className="canvas"
				style={{
					top: canvas.yOffset,
					left: canvas.xOffset,
					width: canvas.width,
					height: canvas.height,
					backgroundColor: isDarkMode ? Color.DarkBlue : Color.White,
					color: isDarkMode ? Color.White : Color.Black
				}}
			>
				<Screen screen={screen} />
			</div>
		</AppContext.Provider>
	);
};
