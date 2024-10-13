import { Button } from "@components";
import { Color } from "@constants";
import { useStyles } from "@hooks";

export const Thanks = () => {
	const { styles } = useStyles();

	return (
		<div style={styles.thanksContainer}>
			<div style={styles.thanksText}>Thanks for the feedback!</div>
			<Button screenTarget="home" backgroundColor={Color.Blue} autoFocus>
				HOME
			</Button>
		</div>
	);
};
