import { Color, GameMode } from "@constants";
import { useAppContext } from "@hooks";

export const Score = () => {
	const {
		canvas: { scaleRatio },
		score,
		gameMode,
		isDarkMode
	} = useAppContext();

	const isShroudedMode = gameMode.name === GameMode.Shrouded;

	return (
		<div
			className="score"
			style={{
				fontSize: `${40 * scaleRatio}px`,
				margin: `${8 * scaleRatio}px ${16 * scaleRatio}px`,
				color: isDarkMode || isShroudedMode ? Color.White : Color.Black
			}}
		>
			{score}
		</div>
	);
};
