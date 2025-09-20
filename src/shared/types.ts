import type { Dispatch, SetStateAction } from "react";

import type { Game } from "@client/game/game";
import { type Color, type GameMode, SocketEvent } from "@shared/constants";

export type TConfig = {
	PORT: number;
	HOST: string;
	MONGO_URI: string;
};

export type TBase = {
	created_at: Date;
	updated_at: Date;
};

type ReverseMap<T> = T[keyof T];
export type SocketEventName = ReverseMap<typeof SocketEvent>;

export type TAppContext = {
	game: Game | undefined;
	setGame: Dispatch<SetStateAction<Game | undefined>>;
	screen: TScreen;
	setScreen: Dispatch<SetStateAction<TScreen>>;
	isScreen: (s: TScreen) => boolean;
	canvas: TCanvas;
	score: number;
	setScore: Dispatch<SetStateAction<number>>;
	isPaused: boolean;
	setIsPaused: Dispatch<SetStateAction<boolean>>;
	isPausedAtStart: boolean;
	setIsPausedAtStart: Dispatch<SetStateAction<boolean>>;
	player_id: string;
	isDarkMode: boolean;
	setIsDarkMode: Dispatch<SetStateAction<boolean>>;
	gameMode: TGameMode;
	setGameMode: Dispatch<SetStateAction<TGameMode>>;
	isGameMode: (gm: TGameModeName) => boolean;
	netStartTime: number;
	setNetStartTime: Dispatch<SetStateAction<number>>;
	scoreRes: TScoreRes | null;
	setScoreRes: Dispatch<SetStateAction<TScoreRes | null>>;
	submitScore: () => Promise<void>;
};

export type TClientToServerSocketEvent = {
	[SocketEvent.Score]: (score: TEncryptedScore) => void;
	[SocketEvent.Rating]: (rating: TRating) => void;
	[SocketEvent.PlayerHighScore]: (player_id: string) => void;
	[SocketEvent.HighScores]: () => void;
	[SocketEvent.NewScore]: () => void;
};

export type TServerToClientSocketEvent = {
	[SocketEvent.Score]: (score: TScoreRes) => void;
	[SocketEvent.Rating]: () => void;
	[SocketEvent.PlayerHighScore]: (playerHighScore: TPlayerHighScoreRes) => void;
	[SocketEvent.HighScores]: (highScores: THighScoresRes) => void;
	[SocketEvent.NewScore]: (highScores: THighScoresRes) => void;
};

export type TSocketReqParams<T extends keyof TClientToServerSocketEvent> = {
	event: T;
	data?: Parameters<TClientToServerSocketEvent[T]>;
};

export type TSocketResArgs<T extends keyof TClientToServerSocketEvent> = Parameters<
	TServerToClientSocketEvent[T]
>;

export type TReactStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type TCanvas = {
	width: number;
	height: number;
	xOffset: number;
	yOffset: number;
	scaleRatio: number;
};

export type TScreen = "home" | "play" | "game-over" | "rate" | "thanks" | "scores" | "announcement";

export type TJumpDirection = "left" | "right";

export type TWall = {
	y: number;
	eleLeft: HTMLElement;
	eleRight: HTMLElement;
	gapX: number;
	isScored: boolean;
	color: Color;
};

export type TBlock = {
	x: number;
	y: number;
	ele: HTMLElement;
	gapX: number;
	color: Color;
};

export type TPoint = { x: number; y: number };

export type TRectangle = { x: number; y: number; width: number; height: number };

export type TDiamond = { cx: number; cy: number; radius: number };

export type TScore = {
	player_id: string;
	score: number;
	sprint_score: number;
	shrouded_score: number;
	gotcha_score: number;
};

export type TEncryptedScore = {
	player_id: string;
	score: string;
	game_mode_name: string;
};

export type TScoreRes = {
	highScore: number;
	existingHighScore: number;
};

export type THighScoresRes = {
	standardScores: number[];
	sprintScores: number[];
	shroudedScores: number[];
	gotchaScores: number[];
};

export type TPlayerHighScoreRes = {
	standardScore: number;
	sprintScore: number;
	shroudedScore: number;
	gotchaScore: number;
};

export type TRating = {
	player_id: string;
	is_thumbs_up: boolean;
	comments: string;
};

export type TGameModeName = ReverseMap<typeof GameMode>;

export type TGameMode = {
	name: TGameModeName;
	description: string;
};

export type TGotchaBrick = {
	x: number;
	y: number;
	ele: HTMLElement;
};
