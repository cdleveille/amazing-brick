import { useEffect, useState } from "react";

import { Button, Text } from "@components";
import { Color, HIGH_SCORE_LOCAL_STORAGE_KEY } from "@constants";
import { useApi, useAppContext, useLocalStorage } from "@hooks";

export const Scores = () => {
	const { getLocalStorageItem, setLocalStorageItem } = useLocalStorage();

	const [highScores, setHighScores] = useState<number[]>();
	const [playerHighScore, setPlayerHighScore] = useState<number>(
		getLocalStorageItem<number>(HIGH_SCORE_LOCAL_STORAGE_KEY) ?? 0
	);

	const {
		canvas: { scaleRatio },
		player_id,
		setScreen
	} = useAppContext();

	const { getHighScores, getPlayerHighScore } = useApi();

	useEffect(() => {
		(async () => {
			const [hiScores, playerHiScore] = await Promise.all([getHighScores(), getPlayerHighScore(player_id)]);
			setHighScores(hiScores.sort((a, b) => b - a));
			setPlayerHighScore(playerHiScore);
			setLocalStorageItem(HIGH_SCORE_LOCAL_STORAGE_KEY, playerHiScore);
		})();
	}, []);

	if (!highScores) return null;

	return (
		<div className="scores-container" style={{ rowGap: `${36 * scaleRatio}px`, marginTop: `${36 * scaleRatio}px` }}>
			<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue} autoFocus>
				<Text size={26}>HOME</Text>
			</Button>
			<div
				className="player-high-score-box"
				style={{
					border: `${1 * scaleRatio}px solid black`,
					borderRadius: `${32 * scaleRatio}px`,
					padding: `${48 * scaleRatio}px`,
					columnGap: `${54 * scaleRatio}px`,
					boxShadow: `0 0 ${2 * scaleRatio}px rgba(0, 0, 0, 0.5)`,
					width: "85%"
				}}
			>
				<div style={{ fontSize: `${24 * scaleRatio}px`, textAlign: "center" }}>
					<div>Best</div>
					<div style={{ fontSize: `${48 * scaleRatio}px` }}>{playerHighScore}</div>
				</div>
				<div style={{ fontSize: `${24 * scaleRatio}px`, textAlign: "center" }}>
					<div>Rank</div>
					<div style={{ fontSize: `${48 * scaleRatio}px` }}>{getRank(playerHighScore, highScores ?? [])}</div>
				</div>
				<div style={{ fontSize: `${24 * scaleRatio}px`, textAlign: "center" }}>
					<div>Top</div>
					<div style={{ fontSize: `${48 * scaleRatio}px` }}>
						{getPercentileRank(playerHighScore, highScores ?? [])}
					</div>
				</div>
			</div>
			<div style={{ width: "85%", textAlign: "center" }}>
				<Text size={42}>Top 10</Text>
				<div style={{ marginTop: `${16 * scaleRatio}px` }}>
					{highScores?.slice(0, 10).map((score, index) => (
						<div
							key={index}
							style={{
								backgroundColor: index % 2 === 0 ? "#eeeeee" : "#ffffff",
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								columnGap: `${16 * scaleRatio}px`,
								width: "100%"
							}}
						>
							<Text size={32}>{score}</Text>
						</div>
					))}
				</div>
			</div>
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
	const numScoresBelow = scores.filter(s => s < score).length;
	const percentileRank = (numScoresBelow / scores.length) * 100;
	return `${Math.max(Math.round(100 - percentileRank), 1)}%`;
};
