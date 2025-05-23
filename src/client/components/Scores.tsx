import { useEffect, useMemo, useState } from "react";

import { Button } from "@client/components/Button";
import { GameModeMenu } from "@client/components/GameMode";
import { Loading } from "@client/components/Loading";
import { Offline } from "@client/components/Offline";
import { Text } from "@client/components/Text";
import { socket } from "@client/helpers/socket";
import { useApi } from "@client/hooks/useApi";
import { useAppContext } from "@client/hooks/useAppContext";
import { useIsOffline } from "@client/hooks/useIsOffline";
import { useStyles } from "@client/hooks/useStyles";
import { Color, GameMode, SocketEvent } from "@shared/constants";
import type { TGameMode, THighScoresRes } from "@shared/types";

export const Scores = () => {
	const { player_id, gameMode } = useAppContext();

	const [selectedGameMode, setSelectedGameMode] = useState(gameMode);
	const [highScores, setHighScores] = useState<THighScoresRes>();

	const { getPlayerHighScore, getHighScores } = useApi();

	const isOffline = useIsOffline();

	const { styles } = useStyles();

	const {
		data: playerHighScore = {
			standardScore: 0,
			sprintScore: 0,
			shroudedScore: 0,
			gotchaScore: 0
		}
	} = getPlayerHighScore(player_id);
	const { data: fetchedHighScores } = getHighScores();

	useEffect(() => {
		const onNewScore = (scores: THighScoresRes) => setHighScores(scores);
		socket.io.on(SocketEvent.NewScore, onNewScore);
		return () => {
			socket.io.off(SocketEvent.NewScore, onNewScore);
		};
	}, []);

	useEffect(() => {
		if (fetchedHighScores) setHighScores(fetchedHighScores);
	}, [fetchedHighScores]);

	const selectedGameModePlayerHighScore = useMemo(() => {
		if (!selectedGameMode || !playerHighScore) return 0;
		switch (selectedGameMode.name) {
			case GameMode.Standard:
				return playerHighScore.standardScore;
			case GameMode.Sprint:
				return playerHighScore.sprintScore;
			case GameMode.Shrouded:
				return playerHighScore.shroudedScore;
			case GameMode.Gotcha:
				return playerHighScore.gotchaScore;
			default:
				return 0;
		}
	}, [selectedGameMode, playerHighScore]);

	const selectedGameModeHighScores = useMemo(() => {
		if (!selectedGameMode || !highScores) return [];
		switch (selectedGameMode.name) {
			case GameMode.Standard:
				return highScores.standardScores;
			case GameMode.Sprint:
				return highScores.sprintScores;
			case GameMode.Shrouded:
				return highScores.shroudedScores;
			case GameMode.Gotcha:
				return highScores.gotchaScores;
			default:
				return [];
		}
	}, [selectedGameMode, highScores]);

	if (isOffline) return <Offline message="Internet connection required to view scores" />;

	if (!selectedGameMode || !highScores) return <Loading />;

	return (
		<div className="scores-container" style={styles.scoresContainer}>
			<Button screenTarget="home" backgroundColor={Color.Blue} autoFocus>
				HOME
			</Button>
			<GameModeMenu
				value={selectedGameMode}
				onSelectOption={(gameMode: TGameMode) => setSelectedGameMode(gameMode)}
			/>
			<div className="player-high-score-box" style={styles.scoresBox}>
				<div style={styles.scoresBoxLabel}>
					<div>Best</div>
					<div style={styles.scoresBoxValue}>{selectedGameModePlayerHighScore}</div>
				</div>
				<div style={styles.scoresBoxLabel}>
					<div>Rank</div>
					<div style={styles.scoresBoxValue}>
						{getRank(selectedGameModePlayerHighScore, selectedGameModeHighScores ?? [])}
					</div>
				</div>
				<div style={styles.scoresBoxLabel}>
					<div>Top</div>
					<div style={styles.scoresBoxValue}>
						{getPercentileRank(
							selectedGameModePlayerHighScore,
							selectedGameModeHighScores ?? []
						)}
					</div>
				</div>
			</div>
			{selectedGameModeHighScores?.length > 0 ? (
				<div style={{ width: "85%", textAlign: "center" }}>
					<Text size={36}>Top 10</Text>
					<div style={styles.scoresTopTenContainer}>
						{selectedGameModeHighScores
							?.sort((a, b) => b - a)
							.slice(0, 10)
							.map((score, index) => (
								<div key={index} style={styles.scoresTopTenItem(index)}>
									<Text size={28} style={{ transition: "unset !important" }}>
										{score}
									</Text>
								</div>
							))}
					</div>
				</div>
			) : (
				<Text size={28}>No scores yet!</Text>
			)}
		</div>
	);
};

const getRank = (score: number, scores: number[]) => {
	if (score === 0 || scores.length === 0) return "N/A";
	const sortedScores = [...scores].sort((a, b) => b - a);
	const rankIndex = sortedScores.indexOf(score);
	if (rankIndex === -1) return "N/A";
	const rank = scores.filter(s => s > score).length + 1;
	const tieCount = scores.filter(s => s === score).length - 1;
	return tieCount === 0 ? rank : `T${rank}`;
};

const getPercentileRank = (score: number, scores: number[]) => {
	if (score === 0 || scores.length === 0) return "N/A";
	const numScoresEqualOrAbove = scores.filter(s => s >= score).length;
	const percentileRank = (numScoresEqualOrAbove / scores.length) * 100;
	return `${Math.max(Math.round(percentileRank), 1)}%`;
};
