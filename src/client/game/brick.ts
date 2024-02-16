import { brickCroppedImg } from "@assets";
import { Game } from "@game";
import { JumpDirection } from "@types";

import { loadImage } from "./util";

const brickImg = loadImage(brickCroppedImg);

export class Brick {
	game: Game;
	x = 0;
	y = 0;
	xv = 0;
	yv = 0;
	g = 0;
	width = 0;
	radius = this.width / 2;
	isTouchingWall = false;
	isHalfwayUp = true;

	constructor(game: Game) {
		this.game = game;
	}

	resize(newWidth: number, scaleRatio: number) {
		const widthRatio = 103 / 1290;
		const oldWidth = (this.width || 1) / widthRatio;
		const ratio = newWidth / oldWidth;
		this.width = newWidth * widthRatio;
		this.radius = this.width / 2;
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
		this.xv = 125 * scaleRatio * xvMult;
		this.yv = -800 * scaleRatio;
	}

	update(delta: number, isGameStarted: boolean, scaleRatio: number) {
		if (isGameStarted) this.yv += this.g * (delta || 0);

		// enforce max yv when touching wall
		if (this.isTouchingWall) {
			this.yv = Math.min(this.yv, 400 * scaleRatio);
		}

		if (this.y <= this.game.height / 2 && this.yv <= 0) {
			this.y = this.game.height / 2;
			this.isHalfwayUp = true;
		} else {
			this.isHalfwayUp = false;
		}

		this.y += this.yv * delta;
		this.x += this.xv * delta;
	}

	draw(ctx: CanvasRenderingContext2D, scaleRatio: number, xOffset: number, yOffset: number) {
		ctx.drawImage(brickImg, this.x - this.radius + xOffset, this.y - this.radius + yOffset, this.width, this.width);
	}
}
