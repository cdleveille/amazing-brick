import { useEffect, useMemo, useState } from "react";

import { Screen } from "@components";
import { PLAYER_ID_LOCAL_STORAGE_KEY } from "@constants";
import { Game } from "@game";
import { AppContext, useLocalStorage } from "@hooks";

import type { TCanvas, TScreen } from "@types";

export const Main = () => {
	const { getLocalStorageItem, setLocalStorageItem } = useLocalStorage();

	const [game, setGame] = useState<Game>();
	const [screen, setScreen] = useState<TScreen>("home");
	const [canvas, setCanvas] = useState<TCanvas>();
	const [score, setScore] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isPausedAtStart, setIsPausedAtStart] = useState(true);

	const player_id = useMemo(
		() => getLocalStorageItem<string>(PLAYER_ID_LOCAL_STORAGE_KEY) ?? crypto.randomUUID(),
		[]
	);

	const onResize = () => {
		const aspectRatio = 1290 / 2294;
		const scaleCoefficient = 838.18;
		const heightUsingMaxWidth = Math.floor(window.innerWidth / aspectRatio);
		if (heightUsingMaxWidth <= window.innerHeight) {
			const canvasUsingMaxWidth = {
				width: Math.max(window.innerWidth, 3),
				height: Math.max(heightUsingMaxWidth, 4),
				xOffset: 0,
				yOffset: (window.innerHeight - heightUsingMaxWidth) / 2,
				scaleRatio: heightUsingMaxWidth / scaleCoefficient
			};
			setCanvas(canvasUsingMaxWidth);
			return canvasUsingMaxWidth;
		}
		const widthUsingMaxHeight = Math.floor(window.innerHeight * aspectRatio);
		const canvasUsingMaxHeight = {
			width: Math.max(widthUsingMaxHeight, 3),
			height: Math.max(window.innerHeight, 4),
			xOffset: (window.innerWidth - widthUsingMaxHeight) / 2,
			yOffset: 0,
			scaleRatio: window.innerHeight / scaleCoefficient
		};
		setCanvas(canvasUsingMaxHeight);
		return canvasUsingMaxHeight;
	};

	useEffect(() => {
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	useEffect(() => {
		if (!game || !canvas) return;
		game.resize(canvas);
	}, [canvas]);

	useEffect(() => {
		if (!game) return;
		game.isPaused = isPaused;
		game.isPausedAtStart = isPausedAtStart;
	}, [isPaused, isPausedAtStart]);

	useEffect(() => {
		setLocalStorageItem(PLAYER_ID_LOCAL_STORAGE_KEY, player_id);
	}, [player_id]);

	useEffect(() => {
		if (!game || screen === "play") return;
		game.stopGameLoop = true;
	}, [screen]);

	useEffect(() => {
		if (!game) return;
		game.score = score;
	}, [score]);

	const submitScore = (score: number) => {
		console.log(score);
		setScreen("game-over");
	};

	if (!canvas) return null;

	return (
		<AppContext.Provider
			value={{
				game,
				setGame,
				screen,
				setScreen,
				canvas,
				score,
				setScore,
				isPaused,
				setIsPaused,
				isPausedAtStart,
				setIsPausedAtStart,
				player_id,
				submitScore
			}}
		>
			<div
				className="canvas"
				style={{ top: canvas.yOffset, left: canvas.xOffset, width: canvas.width, height: canvas.height }}
			>
				<Screen screen={screen} />
			</div>
		</AppContext.Provider>
	);
};
