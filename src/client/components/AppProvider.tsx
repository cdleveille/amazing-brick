import CryptoJS from "crypto-js";
import { type ReactNode, useEffect, useRef, useState } from "react";

import type { Game } from "@/client/game/game";
import { doesSystemPreferDarkTheme, storage } from "@/client/helpers/browser";
import { AppContext } from "@/client/helpers/context";
import { GAME_MODES } from "@/client/helpers/game";
import { useGetLeaderboard, usePostScore } from "@/client/hooks/useApi";
import { useIsOffline } from "@/client/hooks/useIsOffline";
import { usePersistedState } from "@/client/hooks/usePersistedState";
import { useResize } from "@/client/hooks/useResize";
import {
  GAME_MODE_LOCAL_STORAGE_KEY,
  IS_DARK_MODE_LOCAL_STORAGE_KEY,
  PLAYER_ID_LOCAL_STORAGE_KEY,
} from "@/shared/constants";
import type { TCanvas, TGameModeName, TScoreRes, TScreen } from "@/shared/types";

const player_id = storage.local.getItem<string>(PLAYER_ID_LOCAL_STORAGE_KEY) ?? crypto.randomUUID();

export const AppProvider = ({ children }: { children: ReactNode }) => {
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
      false,
  );
  const [gameMode, setGameMode] = useState(
    GAME_MODES.find(gm => gm.name === storage.local.getItem<string>(GAME_MODE_LOCAL_STORAGE_KEY)) ??
      GAME_MODES[0],
  );
  const [netStartTime, setNetStartTime] = useState(0);

  const isScreen = (s: TScreen) => screen === s;

  const isGameMode = (gm: TGameModeName) => gameMode.name === gm;

  const isOffline = useIsOffline();

  useGetLeaderboard(player_id);

  const { mutate: sendScore } = usePostScore({ onSuccess: res => setScoreRes(res) });

  const submitScore = async () => {
    if (isOffline) return;
    sendScore({
      player_id,
      score: CryptoJS.AES.encrypt(scoreRef.current.toString(), player_id).toString(),
      game_mode_name: CryptoJS.AES.encrypt(gameMode.name.toString(), player_id).toString(),
    });
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
        submitScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
