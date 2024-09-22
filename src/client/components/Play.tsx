import { useEffect } from "react";

import { Brick, Jump, Pause, Score } from "@components";
import { Game } from "@game";
import { useAppContext } from "@hooks";

export const Play = () => {
	const ctx = useAppContext();
	const {
		canvas: { scaleRatio },
		setGame,
		setIsPaused,
		isPausedAtStart,
		setIsPausedAtStart
	} = ctx;

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
			<div id="wall1" className="wall"></div>
			<div id="wall2" className="wall"></div>
			<div className="hud">
				<Pause />
				<Score />
			</div>
			{isPausedAtStart && (
				<div className="absolute-center">
					<Jump style={{ marginBottom: `${170 * scaleRatio}px` }} />
				</div>
			)}
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
		if (e.repeat) return;
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
