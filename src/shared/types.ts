import type { Static, TSchema } from "elysia";

import type { Game } from "@/client/game/game";
import type { api } from "@/server/api";
import type { Color, GameMode } from "@/shared/constants";
import type {
  encryptedScoreSchema,
  leaderboardResSchema,
  ratingSchema,
  scoreResSchema,
} from "@/shared/schema";

export type TApi = typeof api;

export type TReactStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type TAppContext = {
  game: Game | undefined;
  setGame: TReactStateSetter<Game | undefined>;
  screen: TScreen;
  setScreen: TReactStateSetter<TScreen>;
  isScreen: (s: TScreen) => boolean;
  canvas: TCanvas;
  score: number;
  setScore: TReactStateSetter<number>;
  isPaused: boolean;
  setIsPaused: TReactStateSetter<boolean>;
  isPausedAtStart: boolean;
  setIsPausedAtStart: TReactStateSetter<boolean>;
  player_id: string;
  isDarkMode: boolean;
  setIsDarkMode: TReactStateSetter<boolean>;
  gameMode: TGameMode;
  setGameMode: TReactStateSetter<TGameMode>;
  isGameMode: (gm: TGameModeName) => boolean;
  netStartTime: number;
  setNetStartTime: TReactStateSetter<number>;
  scoreRes: TScoreRes | null;
  setScoreRes: TReactStateSetter<TScoreRes | null>;
  submitScore: () => Promise<void>;
};

export type TOnSuccess<TReceive extends TSchema> = (data: Static<TReceive>) => void;

export type TBase = {
  created_at: Date;
  updated_at: Date;
};

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
  last_played_at: Date;
};

export type TEncryptedScore = Static<typeof encryptedScoreSchema>;

export type TScoreRes = Static<typeof scoreResSchema>;

export type TLeaderboardRes = Static<typeof leaderboardResSchema>;

export type TRating = Static<typeof ratingSchema>;

export type ReverseMap<T> = T[keyof T];

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
