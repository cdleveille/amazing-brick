import { useEffect } from "react";

import { Brick, Pause, Score } from "@components";
import { Game } from "@game";
import { useAppContext } from "@hooks";

export const Play = () => {
	const { canvas, setGame, setIsPaused } = useAppContext();

	useEffect(() => {
		const game = new Game(canvas);
		game.start();
		setGame(game);
		setIsPaused(false);
		return initInputEventListeners(game);
	}, []);

	return (
		<div className="play-container">
			<div className="hud">
				<Pause />
				<Score />
			</div>
			<Brick id="brick" />
		</div>
	);
};

const initInputEventListeners = (game: Game) => {
	const LEFT_KEYS = ["ArrowLeft", "a"];
	const RIGHT_KEYS = ["ArrowRight", "d"];

	const onMouseDown = (e: MouseEvent) => {
		if (e.button === 0) return game.jump("left");
		if (e.button === 2) return game.jump("right");
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (LEFT_KEYS.includes(e.key)) return game.jump("left");
		if (RIGHT_KEYS.includes(e.key)) return game.jump("right");
	};

	document.addEventListener("mousedown", onMouseDown);
	document.addEventListener("keydown", onKeyDown);

	return () => {
		document.removeEventListener("mousedown", onMouseDown);
		document.removeEventListener("keydown", onKeyDown);
	};
};
