import { useEffect, useState } from "react";

import { Button, Text } from "@components";
import { Color } from "@constants";
import { useApi, useAppContext } from "@hooks";

export const GameOver = () => {
	const {
		canvas: { scaleRatio },
		score,
		setScreen,
		player_id
	} = useAppContext();

	const [highScore, setHighScore] = useState<number>();

	const { submitScore } = useApi();

	useEffect(() => {
		(async () => setHighScore(await submitScore({ player_id, score })))();
	}, []);

	return (
		<div className="game-over" style={{ rowGap: `${64 * scaleRatio}px` }}>
			<h1
				className="game-over-header"
				style={{
					fontSize: `${64 * scaleRatio}px`
				}}
			>
				GAME OVER
			</h1>
			{score === highScore && score > 0 && (
				<div className="new-high-score blink" style={{ fontSize: `${32 * scaleRatio}px`, color: "#ff0000" }}>
					NEW HIGH SCORE!
				</div>
			)}
			<div
				className="game-over-box"
				style={{
					border: `${1 * scaleRatio}px solid black`,
					borderRadius: `${32 * scaleRatio}px`,
					padding: `${48 * scaleRatio}px`,
					columnGap: `${54 * scaleRatio}px`
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
