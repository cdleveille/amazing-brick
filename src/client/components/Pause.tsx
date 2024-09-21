import { Button, Text } from "@components";
import { useAppContext } from "@hooks";

export const Pause = () => {
	const {
		canvas: { width, height, scaleRatio },
		setScreen,
		game,
		isPaused,
		setIsPaused
	} = useAppContext();

	if (!game) return null;

	return (
		<>
			{isPaused && (
				<div className="pause-overlay" style={{ width, height, rowGap: `${32 * scaleRatio}px` }}>
					<Button onClick={() => setScreen("home")} backgroundColor="#7fa3fb">
						<Text size={22}>HOME</Text>
					</Button>
					<Button onClick={() => setIsPaused(false)} backgroundColor="#93cb65">
						<Text size={22}>PLAY</Text>
					</Button>
				</div>
			)}
			<button
				className="btn-pause"
				style={{
					width: `${32 * scaleRatio}px`,
					height: `${32 * scaleRatio}px`,
					border: `${1 * scaleRatio}px solid black`,
					margin: `${8 * scaleRatio}px`
				}}
				onClick={() => setIsPaused(true)}
			>
				<div
					style={{
						width: `${8 * scaleRatio}px`,
						height: `${14 * scaleRatio}px`,
						borderLeft: `${1 * scaleRatio}px solid black`,
						borderRight: `${1 * scaleRatio}px solid black`
					}}
				></div>
			</button>
		</>
	);
};
