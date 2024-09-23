import { Button, Text } from "@components";
import { Color } from "@constants";
import { useAppContext } from "@hooks";

export const GameOver = () => {
	const {
		canvas: { scaleRatio },
		score,
		setScreen
	} = useAppContext();

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
			<div
				className="game-over-box"
				style={{
					border: `${1 * scaleRatio}px solid black`,
					borderRadius: `${32 * scaleRatio}px`,
					padding: `${48 * scaleRatio}px`,
					columnGap: `${48 * scaleRatio}px`
				}}
			>
				<div style={{ fontSize: `${24 * scaleRatio}px` }}>
					<div>Score</div>
					<div style={{ fontSize: `${48 * scaleRatio}px` }}>{score}</div>
				</div>
				<div style={{ fontSize: `${24 * scaleRatio}px` }}>
					<div>Best</div>
					<div style={{ fontSize: `${48 * scaleRatio}px` }}>100</div>
				</div>
			</div>
			<div style={{ display: "flex", flexDirection: "column", rowGap: `${32 * scaleRatio}px` }}>
				<Button onClick={() => setScreen("play")} backgroundColor={Color.Green}>
					<Text size={22}>RETRY</Text>
				</Button>
				<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue}>
					<Text size={22}>HOME</Text>
				</Button>
			</div>
		</div>
	);
};
