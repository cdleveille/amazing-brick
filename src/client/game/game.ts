import { Brick, now } from "@game";

import type { TCanvas } from "@types";

export class Game {
	canvas: TCanvas;
	brick: Brick;

	constructor(canvas: TCanvas) {
		this.canvas = canvas;
		this.brick = new Brick(this);
		console.log("game created");
	}

	start() {
		console.log("game started");
		let current: number, last: number, delta: number;
		const frame = () => {
			current = now();
			// eslint-disable-next-line no-constant-binary-expression
			delta = (current - last ?? now()) / 1000 || 0;
			requestAnimationFrame(frame);
			this.update(delta);
			last = current;
		};
		requestAnimationFrame(frame);
	}

	resize(canvas: TCanvas) {
		this.canvas = canvas;
		console.log(`game resized to ${canvas.width}x${canvas.height}`);
	}

	update(delta: number) {
		this.brick.update(delta);
	}
}
