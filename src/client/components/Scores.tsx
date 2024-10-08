import { useEffect, useState } from "react";

import { Button, Text } from "@components";
import { Color, SocketEvent } from "@constants";
import { useApi, useAppContext, useIsOffline, useSocket } from "@hooks";

export const Scores = () => {
	const [highScores, setHighScores] = useState<number[]>();

	const {
		canvas: { scaleRatio },
		player_id,
		setScreen,
		isDarkMode
	} = useAppContext();

	const { getPlayerHighScore, getHighScores } = useApi();

	const { socket } = useSocket();

	const { isOffline } = useIsOffline();

	const { data: playerHighScore = 0, failureCount: getPlayerHighScoreFailureCount } = getPlayerHighScore(player_id);
	const { data: fetchedHighScores, failureCount: getHighScoresFailureCount } = getHighScores();

	const failureCount = getPlayerHighScoreFailureCount + getHighScoresFailureCount;

	useEffect(() => {
		const onNewScore = (scores: number[]) => setHighScores(scores.sort((a, b) => b - a));
		socket.on(SocketEvent.NewScore, onNewScore);
		return () => {
			socket.off(SocketEvent.NewScore, onNewScore);
		};
	}, []);

	useEffect(() => {
		if (fetchedHighScores) setHighScores(fetchedHighScores);
	}, [fetchedHighScores]);

	if (isOffline && !highScores && failureCount > 0)
		return (
			<div
				className="scores-container"
				style={{ rowGap: `${36 * scaleRatio}px`, marginTop: `${36 * scaleRatio}px` }}
			>
				<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue} autoFocus>
					<Text size={26}>HOME</Text>
				</Button>
				<div
					className="blink"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						fontFamily: "Roboto-Regular",
						rowGap: `${16 * scaleRatio}px`
					}}
				>
					<Text size={28}>OFFLINE</Text>
					<Text size={20}>Internet connection required to view scores</Text>
				</div>
			</div>
		);

	if (!highScores) return null;

	return (
		<div className="scores-container" style={{ rowGap: `${36 * scaleRatio}px`, marginTop: `${36 * scaleRatio}px` }}>
			<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue} autoFocus>
				<Text size={26}>HOME</Text>
			</Button>
			<div
				className="player-high-score-box"
				style={{
					border: `${1 * scaleRatio}px solid ${isDarkMode ? Color.White : Color.Black}`,
					borderRadius: `${32 * scaleRatio}px`,
					padding: `${48 * scaleRatio}px`,
					columnGap: `${54 * scaleRatio}px`,
					boxShadow: `0 0 ${2 * scaleRatio}px ${isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}`,
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
			{highScores?.length > 0 && (
				<div style={{ width: "85%", textAlign: "center" }}>
					<Text size={42}>Top 10</Text>
					<div style={{ marginTop: `${16 * scaleRatio}px` }}>
						{highScores?.slice(0, 10).map((score, index) => (
							<div
								key={index}
								style={{
									backgroundColor:
										index % 2 === 0
											? isDarkMode
												? Color.DarkGray
												: Color.LightGray
											: "transparent",
									display: "flex",
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									columnGap: `${16 * scaleRatio}px`,
									width: "100%",
									transition: "0.2s ease-in-out"
								}}
							>
								<Text size={32} style={{ transition: "unset !important" }}>
									{score}
								</Text>
							</div>
						))}
					</div>
				</div>
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
