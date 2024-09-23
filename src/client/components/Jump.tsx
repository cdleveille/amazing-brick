import { useAppContext } from "@hooks";

type JumpProps = {
	style?: React.CSSProperties;
};

export const Jump = ({ style }: JumpProps) => {
	const {
		canvas: { scaleRatio }
	} = useAppContext();

	return (
		<div style={{ marginBottom: `${80 * scaleRatio}px` }}>
			<img src="./assets/jump.svg" width={250 * scaleRatio} alt="jump" style={style} />
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					columnGap: `${100 * scaleRatio}px`,
					marginTop: `${70 * scaleRatio}px`
				}}
			>
				<div
					className="arrow-left blink"
					style={{
						borderLeft: `${15 * scaleRatio}px solid transparent`,
						borderRight: `${15 * scaleRatio}px solid transparent`,
						borderTop: `${25 * scaleRatio}px solid #FF4445`
					}}
				></div>
				<div
					className="arrow-right blink"
					style={{
						borderLeft: `${15 * scaleRatio}px solid transparent`,
						borderRight: `${15 * scaleRatio}px solid transparent`,
						borderTop: `${25 * scaleRatio}px solid #FF4445`
					}}
				></div>
			</div>
		</div>
	);
};
