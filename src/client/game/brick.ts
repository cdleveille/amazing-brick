import { brickCroppedImg } from "@assets";

import { loadImage } from "./util";

const brickImg = loadImage(brickCroppedImg);

export class Brick {
	x = -1000;
	y = -1000;
	size = 50;

	constructor() {
		//
	}

	init() {
		//
	}

	update(delta: number) {
		console.log(delta);
	}

	draw(ctx: CanvasRenderingContext2D, scaleRatio: number, xOffset: number, yOffset: number) {
		ctx.drawImage(
			brickImg,
			(this.x + xOffset) * scaleRatio,
			(this.y + yOffset) * scaleRatio,
			this.size * scaleRatio,
			this.size * scaleRatio
		);
	}
}
