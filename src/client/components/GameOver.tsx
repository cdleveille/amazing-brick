import CryptoJS from "crypto-js";
import { useEffect } from "react";

import { Button, DarkMode, Text } from "@components";
import { Color } from "@constants";
import { useApi, useAppContext, useSocket } from "@hooks";

export const GameOver = () => {
	const {
		canvas: { scaleRatio },
		score,
		setScreen,
		player_id,
		isDarkMode
	} = useAppContext();

	const { useSubmitScore } = useApi();

	const { socket } = useSocket();

	const { data, mutate: submitScore } = useSubmitScore({
		player_id,
		score: CryptoJS.AES.encrypt(score.toString(), socket.id as string).toString()
	});

	useEffect(submitScore, []);

	if (!data) return null;

	const { highScore, existingHighScore } = data;

	return (
		<div className="game-over" style={{ rowGap: `${64 * scaleRatio}px` }}>
			<DarkMode />
			<h1
				className="game-over-header"
				style={{
					fontSize: `${64 * scaleRatio}px`
				}}
			>
				GAME OVER
			</h1>
			{score === highScore && score > 0 && score > existingHighScore && (
				<div
					className="new-high-score blink"
					style={{ fontSize: `${32 * scaleRatio}px`, color: Color.BrightRed }}
				>
					NEW HIGH SCORE!
				</div>
			)}
			<div
				className="game-over-box"
				style={{
					border: `${1 * scaleRatio}px solid ${isDarkMode ? Color.White : Color.Black}`,
					borderRadius: `${32 * scaleRatio}px`,
					padding: `${48 * scaleRatio}px`,
					columnGap: `${54 * scaleRatio}px`,
					boxShadow: `0 0 ${2 * scaleRatio}px ${isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}`
				}}
			>
				<div style={{ fontSize: `${24 * scaleRatio}px`, textAlign: "center" }}>
					<div>Score</div>
					<div style={{ fontSize: `${48 * scaleRatio}px` }}>{score}</div>
				</div>
				<div style={{ fontSize: `${24 * scaleRatio}px`, textAlign: "center" }}>
					<div>Best</div>
					<div style={{ fontSize: `${48 * scaleRatio}px` }}>{highScore}</div>
				</div>
			</div>
			<div style={{ display: "flex", flexDirection: "column", rowGap: `${32 * scaleRatio}px` }}>
				<Button onClick={() => setScreen("play")} backgroundColor={Color.Green} autoFocus>
					<Text size={26}>RETRY</Text>
				</Button>
				<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue}>
					<Text size={26}>HOME</Text>
				</Button>
			</div>
		</div>
	);
};
