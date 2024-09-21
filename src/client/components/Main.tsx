import { useEffect, useState } from "react";

import { Home, Play } from "@components";
import { Game } from "@game";
import { AppContext } from "@hooks";

import type { TCanvas, TScreen } from "@types";
export const Main = () => {
	const [game, setGame] = useState<Game>();
	const [screen, setScreen] = useState<TScreen>("home");
	const [canvas, setCanvas] = useState<TCanvas>();
	const [score, setScore] = useState(0);
	const [isPaused, setPaused] = useState(false);

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

	const setIsPaused = (isPaused: boolean) => {
		setPaused(isPaused);
		if (game) game.isPaused = isPaused;
	};

	if (!canvas) return null;

	return (
		<AppContext.Provider
			value={{ game, setGame, screen, setScreen, canvas, score, setScore, isPaused, setIsPaused }}
		>
			<div
				className="canvas"
				style={{ top: canvas.yOffset, left: canvas.xOffset, width: canvas.width, height: canvas.height }}
			>
				{screen === "home" ? <Home /> : <Play />}
			</div>
		</AppContext.Provider>
	);
};
