import { useAppContext } from "@hooks";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

export const DarkMode = () => {
	const {
		canvas: { scaleRatio },
		isDarkMode,
		setIsDarkMode
	} = useAppContext();

	return (
		<button
			className="btn-dark-mode"
			onClick={() => setIsDarkMode(isDarkMode => !isDarkMode)}
			style={{ top: 0, right: 0, padding: `${8 * scaleRatio}px` }}
		>
			{isDarkMode ? (
				<LightModeRoundedIcon sx={{ color: "#cccccc", fontSize: `${40 * scaleRatio}px` }} />
			) : (
				<DarkModeRoundedIcon sx={{ color: "#555555", fontSize: `${40 * scaleRatio}px` }} />
			)}
		</button>
	);
};
