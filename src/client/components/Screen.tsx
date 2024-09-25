import { GameOver, Home, Play, Rate, Scores, Thanks } from "@components";
import { useSyncGame } from "@hooks";

import type { TScreen } from "@types";

export const Screen = ({ screen }: { screen: TScreen }) => {
	useSyncGame();

	switch (screen) {
		case "home":
			return <Home />;
		case "play":
			return <Play />;
		case "game-over":
			return <GameOver />;
		case "rate":
			return <Rate />;
		case "scores":
			return <Scores />;
		case "thanks":
			return <Thanks />;
		default:
			throw new Error(`Invalid screen: ${screen}`);
	}
};
