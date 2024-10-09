import { useEffect, useState } from "react";

import { GameMode } from "@constants";
import { now } from "@game";
import { useAppContext } from "@hooks";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";

const INITIAL_SEC = 10;

export const Timer = () => {
	const {
		canvas: { scaleRatio },
		isPausedAtStart,
		isPaused,
		setScreen,
		isDarkMode,
		gameMode,
		setStartTime,
		netStartTime,
		setNetStartTime
	} = useAppContext();

	const [currentTime, setCurrentTime] = useState(0);
	const [timePausedAt, setTimePausedAt] = useState(0);

	const secondsLeft = INITIAL_SEC - formatMsToS(currentTime - netStartTime);

	const isTimerUsed = gameMode.name == GameMode.Sprint;

	useEffect(() => {
		if (isPausedAtStart || !isTimerUsed) return;

		if (isPaused) {
			setTimePausedAt(now());
		} else {
			setNetStartTime(netStartTime + now() - timePausedAt);
		}

		let animationFrameId: number;
		const updateTimer = () => {
			if (isPaused) return;
			setCurrentTime(now());
			animationFrameId = requestAnimationFrame(updateTimer);
		};
		animationFrameId = requestAnimationFrame(updateTimer);
		return () => cancelAnimationFrame(animationFrameId);
	}, [isPausedAtStart, isPaused]);

	useEffect(() => {
		if (isPausedAtStart) return;
		const rightNow = now();
		setStartTime(rightNow);
		if (isTimerUsed) {
			setCurrentTime(rightNow);
			setNetStartTime(rightNow);
		}
	}, [isPausedAtStart]);

	useEffect(() => {
		if (!isTimerUsed || secondsLeft > 0) return;
		setScreen("game-over");
	}, [secondsLeft]);

	if (!isTimerUsed) return null;

	return (
		<div
			style={{
				fontSize: `${40 * scaleRatio}px`,
				fontFamily: "Roboto-Thin",
				fontWeight: "bold",
				margin: `${8 * scaleRatio}px ${16 * scaleRatio}px`,
				marginLeft: `${-4 * scaleRatio}px`,
				color: isDarkMode ? "#cccccc" : "#888888"
			}}
		>
			<TimerRoundedIcon
				className={isPaused || isPausedAtStart ? "" : "rocking"}
				sx={{
					color: isDarkMode ? "#cccccc" : "#888888",
					fontSize: `${28 * scaleRatio}px`,

					marginRight: `${8 * scaleRatio}px`
				}}
			/>
			{isPausedAtStart ? INITIAL_SEC : secondsLeft}
		</div>
	);
};

const formatMsToS = (milliseconds: number) => Math.floor((milliseconds % 60000) / 1000);
