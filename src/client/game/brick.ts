import { brickCroppedImg } from "@assets";
import { Game } from "@game";
import { JumpDirection } from "@types";

import { loadImage } from "./util";

const brickImg = loadImage(brickCroppedImg);

export class Brick {
	game: Game;
	x = -1000;
	y = -1000;
	xv = 0;
	yv = 0;
	g = 2000;
	size = 50;
	isTouchingWall = false;

	constructor(game: Game) {
		this.game = game;
	}

	resize(newWidth: number, sizeRatio: number, scaleRatio: number) {
		const oldWidth = this.size / sizeRatio;
		const ratio = newWidth / oldWidth;
		this.size = newWidth * sizeRatio;
		this.x *= ratio;
		this.y *= ratio;
		this.xv *= ratio;
		this.yv *= ratio;
		this.g = 2000 * scaleRatio;
	}

	jump(direction: JumpDirection, scaleRatio: number) {
		if (this.isTouchingWall) {
			if (direction === JumpDirection.Right && this.x > this.game.width / 2) return;
			else if (direction === JumpDirection.Left && this.x < this.game.width / 2) return;
		}
		const xvMult = direction === JumpDirection.Left ? -1 : 1;
		this.xv = 200 * scaleRatio * xvMult;
		this.yv = -800 * scaleRatio;
	}

	update(delta: number, isGameStarted: boolean, scaleRatio: number) {
		if (isGameStarted) this.yv += this.g * (delta || 0);

		// enforce max yv when touching wall
		if (this.isTouchingWall) {
			this.yv = Math.min(this.yv, 400 * scaleRatio);
		}

		this.y += this.yv * delta;
		this.x += this.xv * delta;
	}

	draw(ctx: CanvasRenderingContext2D, scaleRatio: number, xOffset: number, yOffset: number) {
		ctx.drawImage(
			brickImg,
			this.x - this.size / 2 + xOffset,
			this.y - this.size / 2 + yOffset,
			this.size,
			this.size
		);
	}
}
