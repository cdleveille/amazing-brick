import { useAppContext } from "@hooks";

export const Jump = () => {
	const {
		canvas: { scaleRatio }
	} = useAppContext();

	return (
		<div style={{ marginBottom: `${136 * scaleRatio}px` }}>
			<object data="./assets/jump.svg" type="image/svg+xml" width={250 * scaleRatio} />
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					columnGap: `${100 * scaleRatio}px`,
					marginTop: `${14 * scaleRatio}px`
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
