import { useEffect, useRef } from "react";

import { Jump } from "@/client/components/Jump";
import { Pause } from "@/client/components/Pause";
import { Score } from "@/client/components/Score";
import { Timer } from "@/client/components/Timer";
import { Game } from "@/client/game/game";
import { useApp } from "@/client/hooks/useApp";
import { useStyles } from "@/client/hooks/useStyles";
import { GameMode } from "@/shared/constants";

export const Play = () => {
  const ctx = useApp();
  const { setGame, setIsPaused, isPausedAtStart, setIsPausedAtStart, isGameMode, setScoreRes } =
    ctx;
  const { styles } = useStyles();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: -
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const dpr = window.devicePixelRatio || 1;
    canvasEl.width = ctx.canvas.width * dpr;
    canvasEl.height = ctx.canvas.height * dpr;

    const game = new Game(ctx, canvasEl);
    game.start();
    setGame(game);
    setIsPaused(false);
    setIsPausedAtStart(true);
    setScoreRes(null);

    return initInputEventListeners(game);
  }, []);

  return (
    <div className="play-container">
      <div className="hud">
        <Pause />
        {isGameMode(GameMode.Sprint) && <Timer />}
        <Score />
      </div>
      <canvas ref={canvasRef} className="game-canvas" />
      {isGameMode(GameMode.Shrouded) && <div className="absolute-center" style={styles.shroud} />}
      {isPausedAtStart && <Jump />}
    </div>
  );
};

const initInputEventListeners = (game: Game) => {
  const LEFT_KEYS = ["ArrowLeft", "a", "A"];
  const RIGHT_KEYS = ["ArrowRight", "d", "D"];

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (LEFT_KEYS.includes(e.key)) {
      document.body.style.cursor = "none";
      return game.jump("left");
    }
    if (RIGHT_KEYS.includes(e.key)) {
      document.body.style.cursor = "none";
      return game.jump("right");
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    const midX = window.innerWidth / 2;
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.clientX < midX) game.jump("left");
      if (touch.clientX >= midX) game.jump("right");
    }
    if (document.body.style.cursor !== "none") document.body.style.cursor = "none";
  };

  const onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
  };

  const onMouseMove = () => {
    document.body.style.cursor = "auto";
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchend", onTouchEnd);
  document.addEventListener("mousemove", onMouseMove);

  return () => {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchend", onTouchEnd);
    document.removeEventListener("mousemove", onMouseMove);
    document.body.style.cursor = "auto";
  };
};
