import { author, description, license, version } from "package.json";

export const AppInfo = {
  name: "Amazing Brick",
  version,
  description,
  author: {
    name: author,
    url: "https://www.cdleveille.net",
  },
  license,
  url: "https://amazingbrick.fly.dev",
  themeColor: "#000000",
};

export enum Env {
  Production = "production",
  Development = "development",
}

export enum Path {
  Public = "public",
  Client = "src/client",
}

export enum ErrorMessage {
  _500 = "Internal Server Error",
}

export const STORED_STATE_PREFIX = "state";

export const HASH_PREFIX = "~";

export const HASH_REGEX = new RegExp(`${HASH_PREFIX}.{8}\\.[a-zA-Z0-9]+$`);

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
  BrightRed = "#FF0000",
}

export const OBSTACLE_COLORS = [
  Color.Blue,
  Color.Purple,
  Color.Red,
  Color.Yellow,
  Color.LightGreen,
];

export enum GameMode {
  Standard = "Standard",
  Sprint = "Sprint",
  Shrouded = "Shrouded",
  Gotcha = "Gotcha",
}
