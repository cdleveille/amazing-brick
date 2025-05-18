import { Brick } from "@client/components/Brick";
import { Button } from "@client/components/Button";
import { GameModeMenu } from "@client/components/GameMode";
import { Text } from "@client/components/Text";
import { useAppContext } from "@client/hooks/useAppContext";
import { useStyles } from "@client/hooks/useStyles";
import { Color } from "@shared/constants";
import type { TGameMode } from "@shared/types";

export const Home = () => {
	const { gameMode, setGameMode } = useAppContext();
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
				<GameModeMenu
					value={gameMode}
					onSelectOption={(gameMode: TGameMode) => setGameMode(gameMode)}
				/>
				<Text size={18} style={styles.homeGameModeDescription}>
					{gameMode.description}
				</Text>
			</div>
			<div style={styles.buttonStack}>
				<Button screenTarget="play" backgroundColor={Color.Green} autoFocus>
					PLAY
				</Button>
				<Button screenTarget="scores" backgroundColor={Color.Blue}>
					SCORES
				</Button>
				<Button screenTarget="rate" backgroundColor={Color.Red}>
					RATE
				</Button>
			</div>
		</div>
	);
};
