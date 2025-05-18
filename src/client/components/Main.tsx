import { DarkMode } from "@client/components/DarkMode";
import { GameOver } from "@client/components/GameOver";
import { Home } from "@client/components/Home";
import { Play } from "@client/components/Play";
import { Rate } from "@client/components/Rate";
import { Scores } from "@client/components/Scores";
import { Thanks } from "@client/components/Thanks";
import { useAppContext } from "@client/hooks/useAppContext";
import { useStyles } from "@client/hooks/useStyles";
import { useSync } from "@client/hooks/useSync";
import type { TScreen } from "@shared/types";

export const Main = () => {
	const { screen, isScreen } = useAppContext();
	const { styles } = useStyles();
	useSync();

	return (
		<>
			<div className="cover" style={styles.coverTop} />
			<div className="canvas" style={styles.canvas}>
				{!isScreen("play") && <DarkMode />}
				{getScreen(screen)}
			</div>
			<div className="cover" style={styles.coverBottom} />
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
