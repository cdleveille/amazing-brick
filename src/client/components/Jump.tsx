import { useAppContext } from "@hooks";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export const Jump = () => {
	const {
		canvas: { scaleRatio },
		isPaused
	} = useAppContext();

	return (
		<>
			<svg
				width={250 * scaleRatio}
				viewBox="0 0 246.891 117.059"
				xmlns="http://www.w3.org/2000/svg"
				className="absolute-center"
				style={{ marginTop: `${-90 * scaleRatio}px` }}
			>
				<path
					style={{
						fill: "#a3a3a3",
						fillOpacity: 1,
						strokeWidth: 1.21417,
						strokeLinejoin: "round"
					}}
					transform="rotate(-44.717 -.163 .721)"
					d="M109.686 192.981h24.229v23.456h-24.229ZM-17.829 66.72l-.239-24.228-23.454.232.239 24.227z"
				/>
				<path
					style={{
						fill: "none",
						stroke: "#a3a3a3",
						strokeWidth: 2.13543,
						strokeLinecap: "butt",
						strokeLinejoin: "miter",
						strokeMiterlimit: 4,
						strokeDasharray: "4.27087,2.13543",
						strokeDashoffset: 0,
						strokeOpacity: 1
					}}
					d="M127.895 116.908c.334-9.703 26.424-162.44 85.117-101.704 4.892 5.062 8.45 11.175 12.69 19.84m-105.597 81.864c-.334-9.703-26.423-162.44-85.117-101.704-4.892 5.062-8.45 11.175-12.69 19.84"
					transform="translate(-.555 .094)"
				/>
			</svg>
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
