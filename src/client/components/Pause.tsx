import { useEffect } from "react";

import { Button, Text } from "@components";
import { Color } from "@constants";
import { useAppContext } from "@hooks";

export const Pause = () => {
	const {
		canvas: { width, height, scaleRatio },
		setScreen,
		game,
		isPaused,
		setIsPaused
	} = useAppContext();

	useEffect(() => {
		const onKeyPress = (e: KeyboardEvent) => {
			if (e.repeat) return;
			if (e.key === "p") setIsPaused(isPaused => !isPaused);
		};
		document.addEventListener("keypress", onKeyPress);
		return () => document.removeEventListener("keypress", onKeyPress);
	}, []);

	if (!game) return null;

	return (
		<>
			{isPaused && (
				<div className="pause-overlay" style={{ width, height, rowGap: `${32 * scaleRatio}px` }}>
					<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue} autoFocus>
						<Text size={26}>HOME</Text>
					</Button>
					<Button onClick={() => setIsPaused(false)} backgroundColor={Color.Green}>
						<Text size={26}>PLAY</Text>
					</Button>
				</div>
			)}
			<button
				className="btn-pause"
				style={{
					width: `${36 * scaleRatio}px`,
					height: `${36 * scaleRatio}px`,
					border: `${1 * scaleRatio}px solid black`,
					margin: `${8 * scaleRatio}px`
				}}
				onClick={() => setIsPaused(isPaused => !isPaused)}
			>
				<div
					style={{
						width: `${10 * scaleRatio}px`,
						height: `${16 * scaleRatio}px`,
						borderLeft: `${1 * scaleRatio}px solid black`,
						borderRight: `${1 * scaleRatio}px solid black`
					}}
				></div>
			</button>
		</>
	);
};
