import { Brick, Button, Text } from "@components";
import { useAppContext } from "@hooks";

export const Home = () => {
	const {
		canvas: { scaleRatio },
		setScreen
	} = useAppContext();

	return (
		<div
			className="home-container"
			style={{ paddingTop: `${128 * scaleRatio}px`, rowGap: `${128 * scaleRatio}px` }}
		>
			<div className="header-container">
				<h1
					className="header"
					style={{
						fontSize: `${72 * scaleRatio}px`,
						lineHeight: `${64 * scaleRatio}px`
					}}
				>
					AMAZING BRICK&nbsp;
				</h1>
				<Brick
					style={{
						position: "absolute",
						width: `${36 * scaleRatio}px`,
						height: `${36 * scaleRatio}px`,
						top: `${76 * scaleRatio}px`,
						left: `${33 * scaleRatio}px`
					}}
				/>
			</div>
			<div style={{ display: "flex", flexDirection: "column", rowGap: `${32 * scaleRatio}px` }}>
				<Button onClick={() => setScreen("play")} backgroundColor="#93cb65">
					<Text text="PLAY" size={22} />
				</Button>
				<Button onClick={() => setScreen("home")} backgroundColor="#7fa3fb">
					<Text text="SCORES" size={22} />
				</Button>
				<Button onClick={() => setScreen("home")} backgroundColor="#eb5d49">
					<Text text="RATE" size={22} />
				</Button>
			</div>
		</div>
	);
};
