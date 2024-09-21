import { useState } from "react";

import { Button } from "@components";
import { useAppContext } from "@hooks";

export const Pause = () => {
	const [isPaused, setIsPaused] = useState(false);

	const {
		canvas: { width, height, scaleRatio },
		setScreen,
		game
	} = useAppContext();

	return (
		<>
			{isPaused && (
				<div className="pause-overlay" style={{ width, height, rowGap: `${32 * scaleRatio}px` }}>
					<Button onClick={() => setScreen("home")} backgroundColor="#7fa3fb">
						<span style={{ fontSize: `${22 * scaleRatio}px` }}>HOME</span>
					</Button>
					<Button
						onClick={() => {
							setIsPaused(false);
							if (game) game.isPaused = false;
						}}
						backgroundColor="#93cb65"
					>
						<span style={{ fontSize: `${22 * scaleRatio}px` }}>PLAY</span>
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
				onClick={() => {
					setIsPaused(true);
					if (game) game.isPaused = true;
				}}
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
