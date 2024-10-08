import { Brick, Button, GameModeMenu, Text } from "@components";
import { Color } from "@constants";
import { useAppContext } from "@hooks";
import { TGameMode } from "@types";

export const Home = () => {
	const {
		canvas: { scaleRatio },
		setScreen,
		isDarkMode,
		gameMode,
		setGameMode
	} = useAppContext();

	return (
		<div className="home-container" style={{ paddingTop: `${128 * scaleRatio}px`, rowGap: `${72 * scaleRatio}px` }}>
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
						left: `${33 * scaleRatio}px`,
						backgroundColor: isDarkMode ? Color.White : Color.Black
					}}
				/>
			</div>
			<div
				className="game-mode-select"
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					rowGap: `${16 * scaleRatio}px`
				}}
			>
				<GameModeMenu value={gameMode} onSelectOption={(gameMode: TGameMode) => setGameMode(gameMode)} />
				<Text size={18} style={{ color: isDarkMode ? "#cccccc" : "#555555" }}>
					{gameMode.description}
				</Text>
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
	);
};
