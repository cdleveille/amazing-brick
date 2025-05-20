import CryptoJS from "crypto-js";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { AppContext } from "@client/contexts/app";
import type { Game } from "@client/game/game";
import { doesSystemPreferDarkTheme, storage } from "@client/helpers/browser";
import { GAME_MODES } from "@client/helpers/game";
import { socket } from "@client/helpers/socket";
import { useIsOffline } from "@client/hooks/useIsOffline";
import { usePersistedState } from "@client/hooks/usePersistedState";
import { useResize } from "@client/hooks/useResize";
import {
	GAME_MODE_LOCAL_STORAGE_KEY,
	IS_DARK_MODE_LOCAL_STORAGE_KEY,
	PLAYER_ID_LOCAL_STORAGE_KEY,
	SocketEvent
} from "@shared/constants";
import type { TCanvas, TEncryptedScore, TGameModeName, TScoreRes, TScreen } from "@shared/types";

type TAppContextProviderProps = {
	children: ReactNode;
};

const player_id = storage.local.getItem<string>(PLAYER_ID_LOCAL_STORAGE_KEY) ?? crypto.randomUUID();

export const AppContextProvider = ({ children }: TAppContextProviderProps) => {
	const [game, setGame] = useState<Game>();
	const [screen, setScreen] = usePersistedState<TScreen>("home", "screen");
	const [canvas, setCanvas] = usePersistedState<TCanvas | undefined>(undefined, "canvas");
	const [score, setScore] = usePersistedState(0, "score");
	const scoreRef = useRef(score);
	const [scoreRes, setScoreRes] = usePersistedState<TScoreRes | null>(null, "scoreRes");
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

	const isScreen = (s: TScreen) => screen === s;

	const isGameMode = (gm: TGameModeName) => gameMode.name === gm;

	const isOffline = useIsOffline();

	const submitScore = async () => {
		if (isOffline) return;
		const toSubmit: TEncryptedScore = {
			player_id,
			score: CryptoJS.AES.encrypt(scoreRef.current.toString(), socket.io.id ?? "").toString(),
			game_mode_name: CryptoJS.AES.encrypt(
				gameMode.name.toString(),
				socket.io.id ?? ""
			).toString()
		};
		const res = await socket.emitAndReceive({ event: SocketEvent.Score, data: [toSubmit] });
		setScoreRes(res);
	};

	useEffect(() => {
		scoreRef.current = score;
	}, [score]);

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
				setNetStartTime,
				scoreRes,
				setScoreRes,
				submitScore
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
