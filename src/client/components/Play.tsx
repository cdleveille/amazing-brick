import { useEffect } from "react";

import { Brick, Pause, Score } from "@components";
import { Game } from "@game";
import { useAppContext } from "@hooks";

export const Play = () => {
	const { canvas, setGame } = useAppContext();

	useEffect(() => {
		const game = new Game(canvas);
		game.start();
		setGame(game);
		return initGameEventListeners(game);
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

const initGameEventListeners = (game: Game) => {
	const LEFT_KEYS = ["ArrowLeft", "a"];
	const RIGHT_KEYS = ["ArrowRight", "d"];

	const mouseJump = (e: MouseEvent) => {
		if (e.button === 0) return game.jump("left");
		if (e.button === 2) return game.jump("right");
	};

	const keyJump = (e: KeyboardEvent) => {
		if (LEFT_KEYS.includes(e.key)) return game.jump("left");
		if (RIGHT_KEYS.includes(e.key)) return game.jump("right");
	};

	document.addEventListener("mousedown", mouseJump);
	document.addEventListener("keydown", keyJump);

	return () => {
		document.removeEventListener("mousedown", mouseJump);
		document.removeEventListener("keydown", keyJump);
	};
};
