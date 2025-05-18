import { useEffect, useMemo, useState } from "react";

import { now } from "@client/helpers/browser";
import { useAppContext } from "@client/hooks/useAppContext";
import { useStyles } from "@client/hooks/useStyles";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import { GameMode } from "@shared/constants";

const INITIAL_SEC = 10;

export const Timer = () => {
	const { isPausedAtStart, isPaused, setScreen, gameMode, netStartTime, setNetStartTime } =
		useAppContext();

	const { styles } = useStyles();

	const [currentTime, setCurrentTime] = useState(0);
	const [timePausedAt, setTimePausedAt] = useState(0);

	const secondsLeft = useMemo(
		() => INITIAL_SEC - formatMsToS(currentTime - netStartTime),
		[formatMsToS, currentTime, netStartTime]
	);

	const isTimerUsed = useMemo(() => gameMode.name === GameMode.Sprint, [gameMode]);

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
		<div style={styles.timerContainer}>
			<TimerRoundedIcon
				className={isPaused || isPausedAtStart ? "" : "rocking"}
				sx={styles.timerIcon}
			/>
			{isPausedAtStart ? INITIAL_SEC : secondsLeft}
		</div>
	);
};

const formatMsToS = (milliseconds: number) => Math.floor((milliseconds % 60000) / 1000);
