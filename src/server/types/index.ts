import { Dispatch, SetStateAction } from "react";

import { SocketEvent } from "@constants";
import { Game } from "@game";

export interface IConfig {
	IS_PROD: boolean;
	HOST: string;
	PORT: number;
	RELOAD_PORT: number;
	MONGO_URI: string;
	SKIP_DB: boolean;
}

export interface IBase {
	created_at: Date;
	updated_at: Date;
}

export interface IUser {
	username: string;
	password: string;
}

export interface IError {
	code: number;
	message: string;
}

type ReverseMap<T> = T[keyof T];
export type SocketEventName = ReverseMap<typeof SocketEvent>;

export type TAppContext = {
	game: Game | undefined;
	setGame: Dispatch<SetStateAction<Game | undefined>>;
	screen: TScreen;
	setScreen: Dispatch<SetStateAction<TScreen>>;
	canvas: TCanvas;
	score: number;
	setScore: Dispatch<SetStateAction<number>>;
	isPaused: boolean;
	setIsPaused: (isPaused: boolean) => void;
	isPausedAtStart: boolean;
	setIsPausedAtStart: Dispatch<SetStateAction<boolean>>;
};

export type TCanvas = {
	width: number;
	height: number;
	xOffset: number;
	yOffset: number;
	scaleRatio: number;
};

export type TScreen = "home" | "play";

export type TJumpDirection = "left" | "right";
