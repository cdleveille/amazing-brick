import { Brick, Button, Text } from "@components";
import { Color } from "@constants";
import { useAppContext } from "@hooks";

export const Home = () => {
	const {
		canvas: { scaleRatio },
		setScreen
	} = useAppContext();

	return (
		<>
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
					<Button onClick={() => setScreen("play")} backgroundColor={Color.Green} autoFocus>
						<Text size={26}>PLAY</Text>
					</Button>
					<Button onClick={() => setScreen("scores")} backgroundColor={Color.Blue}>
						<Text size={26}>SCORES</Text>
					</Button>
					<Button onClick={() => setScreen("rate")} backgroundColor={Color.Red}>
						<Text size={26}>RATE</Text>
					</Button>
				</div>
			</div>
			<img src="./assets/jump.svg" alt="jump" style={{ display: "none" }} />
			<img src="./assets/thumbs_up.svg" alt="thumbs up" style={{ display: "none" }} />
			<img src="./assets/thumbs_down.svg" alt="thumbs down" style={{ display: "none" }} />
		</>
	);
};
