import { Brick, Button, GameModeMenu, Text } from "@components";
import { Color } from "@constants";
import { useAppContext, useStyles } from "@hooks";
import { TGameMode } from "@types";

export const Home = () => {
	const { setScreen, gameMode, setGameMode } = useAppContext();
	const { styles } = useStyles();

	return (
		<div className="home-container" style={styles.homeContainer}>
			<div className="header-container">
				<h1 className="header" style={styles.homeHeader}>
					AMAZING BRICK&nbsp;
				</h1>
				<Brick style={styles.homeBrick} />
			</div>
			<div className="game-mode-select" style={styles.homeGameModeSelect}>
				<GameModeMenu value={gameMode} onSelectOption={(gameMode: TGameMode) => setGameMode(gameMode)} />
				<Text size={18} style={styles.homeGameModeDescription}>
					{gameMode.description}
				</Text>
			</div>
			<div style={styles.homeButtonStack}>
				<Button onClick={() => setScreen("play")} backgroundColor={Color.Green} autoFocus>
					<Text size={26}>PLAY</Text>
				</Button>
				<Button onClick={() => setScreen("scores")} backgroundColor={Color.Blue}>
					<Text size={26}>SCORES</Text>
				</Button>
				<Button onClick={() => setScreen("rate")} backgroundColor={Color.Red}>
					<Text size={26}>RATE</Text>
				</Button>
			</div>
		</div>
	);
};
