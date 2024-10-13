import { useEffect } from "react";

import { Button } from "@components";
import { Color } from "@constants";
import { useAppContext, useStyles } from "@hooks";

export const Pause = () => {
	const { game, isPaused, setIsPaused } = useAppContext();
	const { styles } = useStyles();

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
				<div className="pause-overlay" style={styles.pauseOverlay}>
					<Button onClick={() => setIsPaused(false)} backgroundColor={Color.Green} forceTouch autoFocus>
						RESUME
					</Button>
					<Button screenTarget="home" backgroundColor={Color.Blue} forceTouch>
						HOME
					</Button>
				</div>
			)}
			<button
				className={`btn-pause ${isPaused ? "blink" : ""}`}
				style={styles.pauseBtnOuter}
				onClick={() => setIsPaused(isPaused => !isPaused)}
				onTouchStart={e => e.stopPropagation()}
				onTouchEnd={() => setIsPaused(isPaused => !isPaused)}
			>
				<div style={styles.pauseBtnInner}></div>
			</button>
		</>
	);
};
