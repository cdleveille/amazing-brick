import { useAppContext } from "@hooks";

export const Score = () => {
	const {
		canvas: { scaleRatio },
		score
	} = useAppContext();

	return (
		<div className="score" style={{ fontSize: `${32 * scaleRatio}px`, margin: `${6 * scaleRatio}px` }}>
			{score}
		</div>
	);
};
