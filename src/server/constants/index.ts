export enum SocketEvent {
	Score = "score",
	Rating = "rating",
	PlayerHighScore = "player_high_score",
	HighScores = "high_scores",
	NewScore = "new_score"
}

export const PLAYER_ID_LOCAL_STORAGE_KEY = "player_id";

export const IS_DARK_MODE_LOCAL_STORAGE_KEY = "is_dark_mode";

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

export const OBSTACLE_COLORS = [Color.Blue, Color.Purple, Color.Red, Color.Yellow, Color.LightGreen];
