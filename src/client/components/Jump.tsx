import { useAppContext } from "@hooks";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export const Jump = () => {
	const {
		canvas: { scaleRatio },
		isPaused
	} = useAppContext();

	return (
		<>
			<object
				data="./assets/jump.svg"
				type="image/svg+xml"
				width={250 * scaleRatio}
				className="absolute-center"
				style={{ marginTop: `${-92 * scaleRatio}px` }}
			/>
			<div
				className="absolute-center"
				style={{
					display: "flex",
					justifyContent: "center",
					columnGap: `${90 * scaleRatio}px`
				}}
			>
				<PlayArrowIcon
					className="blink"
					sx={{
						rotate: "180deg",
						color: "#ff0000",
						visibility: isPaused ? "hidden" : "visible",
						fontSize: `${40 * scaleRatio}px`
					}}
				/>
				<PlayArrowIcon
					className="blink"
					sx={{
						color: "#ff0000",
						visibility: isPaused ? "hidden" : "visible",
						fontSize: `${40 * scaleRatio}px`
					}}
				></PlayArrowIcon>
			</div>
		</>
	);
};
