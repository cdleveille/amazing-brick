import { useAppContext } from "@client/hooks/useAppContext";
import { useStyles } from "@client/hooks/useStyles";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

export const DarkMode = () => {
	const { isDarkMode, setIsDarkMode } = useAppContext();
	const { styles } = useStyles();

	return (
		<button
			type="button"
			className="btn-dark-mode"
			onClick={() => setIsDarkMode(isDarkMode => !isDarkMode)}
			style={styles.darkModeBtn}
			aria-label="Toggle Dark Mode"
		>
			{isDarkMode ? (
				<DarkModeRoundedIcon sx={styles.darkModeBtnIcon("#cccccc")} />
			) : (
				<LightModeRoundedIcon sx={styles.darkModeBtnIcon("#555555")} />
			)}
		</button>
	);
};
