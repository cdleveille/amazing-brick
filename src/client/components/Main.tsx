import { DarkMode, GameOver, Home, Play, Rate, Scores, Thanks } from "@components";
import { useAppContext, useStyles, useSync } from "@hooks";
import type { TScreen } from "@types";

export const Main = () => {
	const { screen, isScreen } = useAppContext();
	const { styles } = useStyles();
	useSync();

	return (
		<>
			<div className="cover" style={styles.coverTop}></div>
			<div className="canvas" style={styles.canvas}>
				{!isScreen("play") && <DarkMode />}
				{getScreen(screen)}
			</div>
			<div className="cover" style={styles.coverBottom}></div>
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
