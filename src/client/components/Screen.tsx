import { DarkMode, GameOver, Home, Play, Rate, Scores, Thanks } from "@components";
import { useSync } from "@hooks";

import type { TScreen } from "@types";

export const Screen = ({ screen }: { screen: TScreen }) => {
	useSync();

	return (
		<>
			{screen !== "play" && <DarkMode />}
			{getScreen(screen)}
		</>
	);
};

const getScreen = (screen: TScreen) => {
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
