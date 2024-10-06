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
		setIsPaused,
		isDarkMode
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
					<Button onClick={() => setIsPaused(false)} backgroundColor={Color.Green} forceTouch autoFocus>
						<Text size={26}>RESUME</Text>
					</Button>
					<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue} forceTouch>
						<Text size={26}>HOME</Text>
					</Button>
				</div>
			)}
			<button
				className={`btn-pause ${isPaused ? "blink" : ""}`}
				style={{
					width: `${44 * scaleRatio}px`,
					height: `${44 * scaleRatio}px`,
					border: `${1 * scaleRatio}px solid ${isDarkMode ? Color.White : Color.Black}`,
					margin: `${14 * scaleRatio}px`,
					boxShadow: `0 0 ${2 * scaleRatio}px ${isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}`
				}}
				onClick={() => setIsPaused(isPaused => !isPaused)}
				onTouchStart={e => e.stopPropagation()}
				onTouchEnd={() => setIsPaused(isPaused => !isPaused)}
			>
				<div
					style={{
						width: `${12 * scaleRatio}px`,
						height: `${18 * scaleRatio}px`,
						borderLeft: `${1 * scaleRatio}px solid ${isDarkMode ? Color.White : Color.Black}`,
						borderRight: `${1 * scaleRatio}px solid ${isDarkMode ? Color.White : Color.Black}`
					}}
				></div>
			</button>
		</>
	);
};
