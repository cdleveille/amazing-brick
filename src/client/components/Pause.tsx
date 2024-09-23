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
					<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue} autoFocus forceTouch>
						<Text size={26}>HOME</Text>
					</Button>
					<Button onClick={() => setIsPaused(false)} backgroundColor={Color.Green} forceTouch>
						<Text size={26}>PLAY</Text>
					</Button>
				</div>
			)}
			<button
				className="btn-pause"
				style={{
					width: `${44 * scaleRatio}px`,
					height: `${44 * scaleRatio}px`,
					border: `${1 * scaleRatio}px solid black`,
					margin: `${14 * scaleRatio}px`,
					boxShadow: `0 0 ${2 * scaleRatio}px rgba(0, 0, 0, 0.5)`
				}}
				onClick={() => setIsPaused(isPaused => !isPaused)}
				onTouchStart={e => e.stopPropagation()}
				onTouchEnd={() => setIsPaused(isPaused => !isPaused)}
			>
				<div
					style={{
						width: `${12 * scaleRatio}px`,
						height: `${18 * scaleRatio}px`,
						borderLeft: `${1 * scaleRatio}px solid black`,
						borderRight: `${1 * scaleRatio}px solid black`
					}}
				></div>
			</button>
		</>
	);
};
