import { Brick, now, Obstacle } from "@game";

import type { TAppContext, TCanvas, TJumpDirection } from "@types";

export class Game {
	ctx: TAppContext;
	canvas: TCanvas;
	brick: Brick;
	obstacle: Obstacle;
	gravity: number;
	isPaused: boolean;
	isPausedAtStart: boolean;

	constructor(ctx: TAppContext) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.brick = new Brick(this);
		this.obstacle = new Obstacle(this);
		this.gravity = 1500 * this.canvas.scaleRatio;
		this.isPaused = false;
		this.isPausedAtStart = true;
	}

	start() {
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

	jump(direction: TJumpDirection) {
		if (this.isPaused) return;
		if (this.isPausedAtStart) {
			this.isPausedAtStart = false;
			this.ctx.setIsPausedAtStart(false);
		}
		this.brick.jump(direction);
	}

	resize(canvas: TCanvas) {
		const resizeRatio = canvas.width / this.canvas.width;
		this.canvas = canvas;
		this.gravity = this.gravity * resizeRatio;
		this.brick.resize(resizeRatio);
		this.obstacle.resize(resizeRatio);
		console.log(`game resized to ${canvas.width}x${canvas.height}`);
	}

	handleCollisions() {
		if (this.brick.y <= this.canvas.height / 2) {
			this.brick.y = this.canvas.height / 2;
			this.brick.isCollidingTop = true;
		} else this.brick.isCollidingTop = false;

		if (this.brick.y + this.brick.diagonalRadius >= this.canvas.height) {
			this.brick.y = this.canvas.height - this.brick.diagonalRadius;
			this.brick.yv = 0;
		}

		if (this.brick.x - this.brick.diagonalRadius <= 0) {
			this.brick.x = this.brick.diagonalRadius;
			this.brick.xv = 0;
			this.brick.isCollidingLeft = true;
			if (this.brick.yv > 300 * this.canvas.scaleRatio) {
				this.brick.yv = 300 * this.canvas.scaleRatio;
			}
		} else if (this.brick.x + this.brick.diagonalRadius >= this.canvas.width) {
			this.brick.x = this.canvas.width - this.brick.diagonalRadius;
			this.brick.xv = 0;
			this.brick.isCollidingRight = true;
			if (this.brick.yv > 300 * this.canvas.scaleRatio) {
				this.brick.yv = 300 * this.canvas.scaleRatio;
			}
		}
	}

	update(delta: number) {
		if (this.isPaused || this.isPausedAtStart) return;
		this.brick.update(delta);
		this.obstacle.update(delta);
		this.handleCollisions();
	}
}
