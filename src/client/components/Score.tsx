import { useAppContext } from "@client/hooks/useAppContext";
import { useStyles } from "@client/hooks/useStyles";

export const Score = () => {
	const { score } = useAppContext();
	const { styles } = useStyles();

	return (
		<div className="score" style={styles.score}>
			{score}
		</div>
	);
};
