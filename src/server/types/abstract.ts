import { Screen } from "@types";

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

export type GameScreen = `${Screen}`;

export interface IGamestate {
	screen: GameScreen;
}
