import { assertGetElementById, Game } from "@game";

export class Brick {
	game: Game;
	ele: HTMLElement;
	x: number;
	y: number;
	xv: number;
	yv: number;

	constructor(game: Game) {
		this.game = game;
		this.ele = assertGetElementById("brick");
		console.log(this.ele);
		this.x = this.game.canvas.width / 2;
		this.y = this.game.canvas.height / 2;
		this.xv = 0;
		this.yv = 0;
	}

	update(delta: number) {
		const scaleRatio = this.game.canvas.scaleRatio;
		const brickSize = 28 * scaleRatio;
		const brickHypotenuse = (brickSize ** 2 * 2) ** 0.5;

		this.x += this.xv * delta;
		this.y += this.yv * delta;
		this.ele.style.width = `${brickSize}px`;
		this.ele.style.height = `${brickSize}px`;
		// this.ele.style.left = `${this.x * scaleRatio + (brickHypotenuse - brickSize) / 2 - brickHypotenuse / 2}px`;
		// this.ele.style.top = `${this.y * scaleRatio + (brickHypotenuse - brickSize) / 2 - brickHypotenuse / 2}px`;
		this.ele.style.left = `${this.x * scaleRatio}px`;
		this.ele.style.top = `${this.y * scaleRatio}px`;
	}
}
