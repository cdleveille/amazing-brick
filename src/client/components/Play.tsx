import { useEffect } from "react";

import { GameObject } from "@client/components/GameObject";
import { Jump } from "@client/components/Jump";
import { Pause } from "@client/components/Pause";
import { Score } from "@client/components/Score";
import { Timer } from "@client/components/Timer";
import { Game } from "@client/game/game";
import { useAppContext } from "@client/hooks/useAppContext";
import { GameMode } from "@shared/constants";

export const Play = () => {
	const ctx = useAppContext();
	const { setGame, setIsPaused, isPausedAtStart, setIsPausedAtStart, isGameMode } = ctx;

	useEffect(() => {
		const game = new Game(ctx);
		game.start();
		setGame(game);
		setIsPaused(false);
		setIsPausedAtStart(true);

		return initInputEventListeners(game);
	}, []);

	return (
		<div className="play-container">
			<div className="hud">
				<Pause />
				{isGameMode(GameMode.Sprint) && <Timer />}
				<Score />
			</div>
			<GameObject />
			{isPausedAtStart && <Jump />}
		</div>
	);
};

const initInputEventListeners = (game: Game) => {
	const LEFT_KEYS = ["ArrowLeft", "a"];
	const RIGHT_KEYS = ["ArrowRight", "d"];

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
		for (let i = 0; i < e.touches.length; i++) {
			const touch = e.touches[i];
			if (touch.clientX < window.innerWidth / 2) game.jump("left");
			if (touch.clientX >= window.innerWidth / 2) game.jump("right");
		}
		document.body.style.cursor = "none";
	};

	const onTouchEnd = (e: TouchEvent) => {
		e.preventDefault();
	};

	const onMouseMove = () => {
		document.body.style.cursor = "auto";
	};

	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("touchstart", onTouchStart);
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
