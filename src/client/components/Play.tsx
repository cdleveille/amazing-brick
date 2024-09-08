import { useEffect } from "react";

import { Brick, Pause, Score } from "@components";
import { Game } from "@game";
import { useAppContext } from "@hooks";

export const Play = () => {
	const { canvas, setGame } = useAppContext();

	useEffect(() => {
		const newGame = new Game(canvas);
		setGame(newGame);
		newGame.start();
	}, []);

	return (
		<div className="play-container">
			<Brick id="brick" />
			<div className="hud">
				<Pause />
				<Score />
			</div>
		</div>
	);
};
