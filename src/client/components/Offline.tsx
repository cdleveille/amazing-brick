import { Button, Text } from "@components";
import { Color } from "@constants";
import { useStyles } from "@hooks";

export const Offline = ({ message, isHideHomeBtn }: { message: string; isHideHomeBtn?: boolean }) => {
	const { styles } = useStyles();

	return (
		<div className="offline-container" style={styles.scoresContainer}>
			{!isHideHomeBtn && (
				<Button screenTarget="home" backgroundColor={Color.Blue} autoFocus>
					HOME
				</Button>
			)}
			<div className="blink" style={styles.offline}>
				<Text size={28}>OFFLINE</Text>
				<Text size={20} style={{ width: "70%", textAlign: "center" }}>
					{message}
				</Text>
			</div>
		</div>
	);
};
