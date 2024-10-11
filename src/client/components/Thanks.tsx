import { Button, Text } from "@components";
import { Color } from "@constants";
import { useAppContext, useStyles } from "@hooks";

export const Thanks = () => {
	const { setScreen } = useAppContext();
	const { styles } = useStyles();

	return (
		<div style={styles.thanksContainer}>
			<div style={styles.thanksText}>Thanks for the feedback!</div>
			<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue} autoFocus>
				<Text size={26}>HOME</Text>
			</Button>
		</div>
	);
};
