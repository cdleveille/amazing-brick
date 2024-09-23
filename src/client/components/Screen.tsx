import { GameOver, Home, Play } from "@components";

import type { TScreen } from "@types";

export const Screen = ({ screen }: { screen: TScreen }) => {
	switch (screen) {
		case "home":
			return <Home />;
		case "play":
			return <Play />;
		case "game-over":
			return <GameOver />;
		default:
			throw new Error(`Invalid screen: ${screen}`);
	}
};
