import { useEffect, useState } from "react";

import { Button, Text } from "@components";
import { Color } from "@constants";
import { useAppContext, useStyles } from "@hooks";
import CircularProgress from "@mui/material/CircularProgress";

export const Loading = () => {
	const [isShowLoadingIndicator, setIsShowLoadingIndicator] = useState(false);

	const { setScreen } = useAppContext();

	const { styles } = useStyles();

	useEffect(() => {
		const timeout = setTimeout(() => setIsShowLoadingIndicator(true), 1000);
		return () => clearTimeout(timeout);
	}, []);

	if (!isShowLoadingIndicator) return null;

	return (
		<div style={styles.loadingContainer}>
			<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue} autoFocus>
				<Text size={26}>HOME</Text>
			</Button>
			<CircularProgress size={styles.loadingIndicator.size} sx={styles.loadingIndicator} />
		</div>
	);
};
