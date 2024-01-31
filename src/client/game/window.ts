import { Game } from "@game";
import { IResize } from "@types";

export class WindowHandler {
	canvas: HTMLCanvasElement;
	game: Game;

	constructor(canvas: HTMLCanvasElement, game: Game) {
		this.canvas = canvas;
		this.game = game;

		window.addEventListener("resize", () => {
			this.resize();
		});

		window.addEventListener("orientationchange", () => {
			this.resize();
		});

		// window.addEventListener("online", () => {
		// 	setIsOffline(false);
		// });

		// window.addEventListener("offline", () => {
		// 	setIsOffline(true);
		// });

		this.resize();
	}

	resize() {
		this.canvas.width = Math.max(screen.width, window.innerWidth);
		this.canvas.height = Math.max(screen.height, window.innerHeight);
		const newScreen = this.getNewGameScreen(1290, 2294);
		this.game.resize(newScreen);
	}

	getNewGameScreen(widthRatio: number, heightRatio: number) {
		const heightUsingMaxWidth = Math.floor(window.innerWidth * (heightRatio / widthRatio));
		if (heightUsingMaxWidth <= window.innerHeight)
			return {
				width: Math.max(window.innerWidth, 3),
				height: Math.max(heightUsingMaxWidth, 4),
				xOffset: 0,
				yOffset: (window.innerHeight - heightUsingMaxWidth) / 2
			} as IResize;
		const widthUsingMaxHeight = Math.floor(window.innerHeight * (widthRatio / heightRatio));
		return {
			width: Math.max(widthUsingMaxHeight, 3),
			height: Math.max(window.innerHeight, 4),
			xOffset: (window.innerWidth - widthUsingMaxHeight) / 2,
			yOffset: 0
		} as IResize;
	}
}
