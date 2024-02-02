import { Game, InputHandler, now, WindowHandler } from "@game";

export const start = (canvas: HTMLCanvasElement, game: Game) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("cannot get 2d context");
	new InputHandler(canvas, game);
	new WindowHandler(canvas, game);

	let current: number, last: number, delta: number;

	const frame = () => {
		current = now();
		delta = (current - last ?? now()) / 1000;
		requestAnimationFrame(frame);
		game.update(delta);
		game.draw(ctx);
		last = current;
	};

	requestAnimationFrame(frame);
};
