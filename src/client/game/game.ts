export class Game {
	constructor() {
		//
	}

	init() {
		//
	}

	update(delta: number) {
		console.log(delta);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}
}
