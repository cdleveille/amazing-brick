import { useState } from "react";

import { Home, Play } from "@screens";
import { GameScreen, IGamestate, Screen } from "@types";

export const Main = () => {
	const [gamestate, setGamestate] = useState<IGamestate>({ screen: Screen.Home });

	const setScreen = (screen: GameScreen) => setGamestate(gamestate => ({ ...gamestate, screen }));

	switch (gamestate.screen) {
		case Screen.Play:
			return <Play />;
		default:
			return <Home setScreen={setScreen} />;
	}
};
