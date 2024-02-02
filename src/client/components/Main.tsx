import { useCallback, useState } from "react";

import { Canvas } from "@components";
import { Game } from "@game";
import { Home } from "@screens";
import { GameScreen, IGamestate, Screen } from "@types";

export const Main = () => {
	const [gamestate, setGamestate] = useState<IGamestate>({ screen: Screen.Home });
	const [scaleRatio, setScaleRatio] = useState(0);
	const [, setOffset] = useState({ xOffset: 0, yOffset: 0 });

	const setScreen = (screen: GameScreen) => setGamestate(gamestate => ({ ...gamestate, screen }));

	const newGame = useCallback(() => new Game(setScaleRatio, setOffset), []);
	const [game] = useState(newGame);

	const getScreen = () => {
		switch (gamestate.screen) {
			case Screen.Home:
				return <Home setScreen={setScreen} scaleRatio={scaleRatio} initGame={() => game.init()} />;
		}
	};

	return (
		<>
			<Canvas game={game} />
			{getScreen()}
		</>
	);
};
