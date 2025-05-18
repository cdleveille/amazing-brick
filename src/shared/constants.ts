import type { TConfig } from "@shared/types";
import { author, description, license, version } from "package.json";

export const AppInfo = {
	name: "Amazing Brick",
	version,
	description,
	author: {
		name: author,
		url: "https://www.cdleveille.net"
	},
	license,
	url: "https://amazingbrick.fly.dev"
};

export const DefaultConfig: TConfig = {
	PORT: 3000,
	HOST: "http://localhost",
	MONGO_URI: "mongodb://localhost:27017/amazing-brick"
};

export enum Env {
	Production = "production",
	Development = "development"
}

export enum Path {
	Public = "public",
	ClientSrc = "src/client"
}

export enum SocketEvent {
	Connect = "connect",
	Score = "score",
	Rating = "rating",
	PlayerHighScore = "player_high_score",
	HighScores = "high_scores",
	NewScore = "new_score"
}

export enum Route {
	Api = "/api"
}

export enum ErrorMessage {
	InternalServerError = "Internal Server Error"
}

export const PLAYER_ID_LOCAL_STORAGE_KEY = "player_id";

export const IS_DARK_MODE_LOCAL_STORAGE_KEY = "is_dark_mode";

export const GAME_MODE_LOCAL_STORAGE_KEY = "game_mode";

export enum Color {
	White = "#FFFFFF",
	Black = "#000000",
	Green = "#93CB65",
	Blue = "#7FA3FB",
	Red = "#EB5D49",
	Purple = "#945DB5",
	LightGreen = "#8AE792",
	Yellow = "#E6D922",
	DarkBlue = "#111827",
	DarkGray = "#0D1117",
	LightGray = "#EEEEEE",
	Gray = "#AAAAAA",
	BrightRed = "#FF0000"
}

export const OBSTACLE_COLORS = [
	Color.Blue,
	Color.Purple,
	Color.Red,
	Color.Yellow,
	Color.LightGreen
];

export enum GameMode {
	Standard = "Standard",
	Sprint = "Sprint",
	Shrouded = "Shrouded",
	Gotcha = "Gotcha"
}

export const STORED_STATE_PREFIX = "state";

export const WS_TIMEOUT_MS = 5000;

export const HASH_PREFIX = "~";

export const HASH_REGEX = new RegExp(`${HASH_PREFIX}.{8}\\.[a-zA-Z0-9]+$`);
