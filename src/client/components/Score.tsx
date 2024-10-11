import { useAppContext, useStyles } from "@hooks";

export const Score = () => {
	const { score } = useAppContext();
	const { styles } = useStyles();

	return (
		<div className="score" style={styles.score}>
			{score}
		</div>
	);
};
