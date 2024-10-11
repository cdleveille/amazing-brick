import { useAppContext, useStyles } from "@hooks";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

export const DarkMode = () => {
	const { isDarkMode, setIsDarkMode } = useAppContext();
	const { styles } = useStyles();

	return (
		<button
			className="btn-dark-mode"
			onClick={() => setIsDarkMode(isDarkMode => !isDarkMode)}
			style={styles.darkModeBtn}
		>
			{isDarkMode ? (
				<LightModeRoundedIcon sx={styles.darkModeBtnIcon("#cccccc")} />
			) : (
				<DarkModeRoundedIcon sx={styles.darkModeBtnIcon("#555555")} />
			)}
		</button>
	);
};
