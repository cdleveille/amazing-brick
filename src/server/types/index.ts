import { Dispatch, SetStateAction } from "react";

import { Color, SocketEvent } from "@constants";
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
	setIsPaused: Dispatch<SetStateAction<boolean>>;
	isPausedAtStart: boolean;
	setIsPausedAtStart: Dispatch<SetStateAction<boolean>>;
	player_id: string;
	submitScore: (score: number) => void;
};

export type TCanvas = {
	width: number;
	height: number;
	xOffset: number;
	yOffset: number;
	scaleRatio: number;
};

export type TScreen = "home" | "play" | "game-over";

export type TJumpDirection = "left" | "right";

export type TWall = {
	y: number;
	eleLeft: HTMLElement;
	eleRight: HTMLElement;
	gapX: number;
	isScored: boolean;
	color: Color;
};

export type TPoint = {
	x: number;
	y: number;
};

export type TRectangle = {
	x: number; // Top-left corner x
	y: number; // Top-left corner y
	width: number;
	height: number;
};

export type TDiamond = {
	cx: number; // Center x
	cy: number; // Center y
	size: number; // Distance from center to one of the points (half diagonal length)
};

export type TScore = {
	player_id: string;
	score: number;
};
