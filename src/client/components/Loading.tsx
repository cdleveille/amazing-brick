import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";

import { Button } from "@client/components/Button";
import { usePersistedState } from "@client/hooks/usePersistedState";
import { useStyles } from "@client/hooks/useStyles";
import { Color } from "@shared/constants";

export const Loading = () => {
	const [isShowLoadingIndicator, setIsShowLoadingIndicator] = usePersistedState(
		false,
		"isShowLoadingIndicator"
	);

	const { styles } = useStyles();

	useEffect(() => {
		const timeout = setTimeout(() => setIsShowLoadingIndicator(true), 1000);
		return () => clearTimeout(timeout);
	}, []);

	if (!isShowLoadingIndicator) return null;

	return (
		<div style={styles.loadingContainer}>
			<Button screenTarget="home" backgroundColor={Color.Blue} autoFocus>
				HOME
			</Button>
			<CircularProgress size={styles.loadingIndicator.size} sx={styles.loadingIndicator} />
		</div>
	);
};
