import { useEffect } from "react";

import CryptoJS from "crypto-js";

import { Button, Loading, Text } from "@components";
import { Color } from "@constants";
import { useApi, useAppContext, useIsOffline, useStyles } from "@hooks";
import { socket } from "@utils";

export const GameOver = () => {
	const { score, player_id, gameMode } = useAppContext();

	const { useSubmitScore } = useApi();

	const { isOffline } = useIsOffline();

	const { styles } = useStyles();

	const { data, mutate: submitScore } = useSubmitScore({
		player_id,
		score: !isOffline ? CryptoJS.AES.encrypt(score.toString(), socket.id ?? "").toString() : "",
		game_mode_name: !isOffline ? CryptoJS.AES.encrypt(gameMode.name.toString(), socket.id ?? "").toString() : ""
	});

	useEffect(() => {
		if (!isOffline) submitScore();
	}, []);

	if (!isOffline && !data) return <Loading />;

	const { highScore, existingHighScore } = data ?? {};

	return (
		<div className="game-over-container" style={styles.gameOverContainer}>
			<h1 className="game-over-header" style={styles.gameOverHeader}>
				GAME OVER
			</h1>
			{isOffline && (
				<div className="blink" style={styles.offline}>
					<Text size={28}>OFFLINE</Text>
					<Text size={20} style={{ width: "70%", textAlign: "center" }}>
						Internet connection required to submit and view high score
					</Text>
				</div>
			)}
			{!isOffline && score === highScore && score > 0 && score > (existingHighScore ?? 0) && (
				<div className="new-high-score blink" style={styles.gameOverNewHighScore}>
					NEW HIGH SCORE!
				</div>
			)}
			<div className="game-over-box" style={styles.gameOverBox}>
				<Text size={20}>{gameMode.name.toUpperCase()}</Text>
				<div style={styles.gameOverBoxInner}>
					<div style={styles.gameOverBoxLabel}>
						<div>Score</div>
						<div style={styles.gameOverBoxValue}>{score}</div>
					</div>
					{!isOffline && (
						<div style={styles.gameOverBoxLabel}>
							<div>Best</div>
							<div style={styles.gameOverBoxValue}>{highScore}</div>
						</div>
					)}
				</div>
			</div>
			<div style={styles.buttonStack}>
				<Button screenTarget="play" backgroundColor={Color.Green} autoFocus>
					RETRY
				</Button>
				<Button screenTarget="home" backgroundColor={Color.Blue}>
					HOME
				</Button>
			</div>
		</div>
	);
};
