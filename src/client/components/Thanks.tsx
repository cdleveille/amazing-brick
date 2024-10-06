import { Button, DarkMode, Text } from "@components";
import { Color } from "@constants";
import { useAppContext } from "@hooks";

export const Thanks = () => {
	const {
		canvas: { scaleRatio },
		setScreen
	} = useAppContext();

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100%",
				rowGap: `${32 * scaleRatio}px`
			}}
		>
			<DarkMode />
			<div
				style={{
					fontSize: `${24 * scaleRatio}px`,
					textAlign: "center",
					fontFamily: "Roboto-Thin",
					fontWeight: "bolder"
				}}
			>
				Thanks for the feedback!
			</div>
			<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue} autoFocus>
				<Text size={26}>HOME</Text>
			</Button>
		</div>
	);
};
