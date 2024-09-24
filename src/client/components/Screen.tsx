import { GameOver, Home, Play, Rate } from "@components";
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
		default:
			throw new Error(`Invalid screen: ${screen}`);
	}
};
