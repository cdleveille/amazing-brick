import { useEffect } from "react";

import { Brick, Jump, Obstacle, Pause, Score } from "@components";
import { Game } from "@game";
import { useAppContext } from "@hooks";

export const Play = () => {
	const ctx = useAppContext();
	const { setGame, setIsPaused, isPausedAtStart, setIsPausedAtStart } = ctx;

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
			<Obstacle />
			<div className="hud">
				<Pause />
				<Score />
			</div>
			{isPausedAtStart && (
				<div className="absolute-center">
					<Jump />
				</div>
			)}
			<Brick id="brick" />
		</div>
	);
};

const initInputEventListeners = (game: Game) => {
	const LEFT_KEYS = ["ArrowLeft", "a"];
	const RIGHT_KEYS = ["ArrowRight", "d"];

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.repeat) return;
		if (LEFT_KEYS.includes(e.key)) return game.jump("left");
		if (RIGHT_KEYS.includes(e.key)) return game.jump("right");
	};

	const onTouchStart = (e: TouchEvent) => {
		for (let i = 0; i < e.touches.length; i++) {
			const touch = e.touches[i];
			if (touch.clientX < window.innerWidth / 2) game.jump("left");
			if (touch.clientX >= window.innerWidth / 2) game.jump("right");
		}
	};

	const onTouchEnd = (e: TouchEvent) => {
		e.preventDefault();
	};

	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("touchstart", onTouchStart);
	document.addEventListener("touchend", onTouchEnd);

	return () => {
		document.removeEventListener("keydown", onKeyDown);
		document.removeEventListener("touchstart", onTouchStart);
		document.removeEventListener("touchend", onTouchEnd);
	};
};
