import { useAppContext } from "@hooks";

export const Score = () => {
	const {
		canvas: { scaleRatio },
		score
	} = useAppContext();

	return (
		<div
			className="score"
			style={{
				fontSize: `${40 * scaleRatio}px`,
				margin: `${8 * scaleRatio}px ${16 * scaleRatio}px`
			}}
		>
			{score}
		</div>
	);
};
