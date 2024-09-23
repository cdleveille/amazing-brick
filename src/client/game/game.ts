import { Brick, isRectangleIntersectingDiamond, now, Obstacle } from "@game";

import type { TAppContext, TCanvas, TJumpDirection } from "@types";

export class Game {
	ctx: TAppContext;
	canvas: TCanvas;
	brick: Brick;
	obstacle: Obstacle;
	gravity: number;
	isPaused = false;
	isPausedAtStart = true;
	isGameOver = false;
	stopGameLoop = false;
	score = 0;

	constructor(ctx: TAppContext) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.brick = new Brick(this);
		this.obstacle = new Obstacle(this);
		this.gravity = 1500 * this.canvas.scaleRatio;
	}

	start() {
		this.ctx.setScore(0);
		this.stopGameLoop = false;
		document.getElementsByClassName("canvas").item(0)?.classList.remove("shake");
		let current: number, last: number, delta: number;
		const frame = () => {
			if (this.stopGameLoop) return;
			current = now();
			// eslint-disable-next-line no-constant-binary-expression
			delta = (current - last ?? now()) / 1000 || 0;
			requestAnimationFrame(frame);
			this.update(delta);
			last = current;
		};
		requestAnimationFrame(frame);
	}

	restart() {
		this.isGameOver = false;
		this.ctx.setIsPaused(false);
		this.ctx.setIsPausedAtStart(true);
		this.brick = new Brick(this);
		this.obstacle = new Obstacle(this);
	}

	jump(direction: TJumpDirection) {
		if (this.isPaused) return;
		if (this.isGameOver) return;
		this.ctx.setIsPausedAtStart(false);
		this.brick.jump(direction);
	}

	resize(canvas: TCanvas) {
		const resizeRatio = canvas.width / this.canvas.width;
		this.canvas = canvas;
		this.gravity = this.gravity * resizeRatio;
		this.brick.resize(resizeRatio);
		this.obstacle.resize(resizeRatio);
	}

	handleCollisions() {
		if (this.brick.y <= this.canvas.height / 2) {
			this.brick.y = this.canvas.height / 2;
			this.brick.isCollidingTop = true;
		} else this.brick.isCollidingTop = false;

		if (this.brick.y + this.brick.diagonalRadius >= this.canvas.height) {
			this.ctx.submitScore();
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

		for (const wall of this.obstacle.walls) {
			if (
				isRectangleIntersectingDiamond(
					{ x: 0, y: wall.y, width: wall.gapX, height: this.obstacle.wallHeight },
					{ cx: this.brick.x, cy: this.brick.y, size: this.brick.diagonalRadius }
				)
			) {
				this.crash();
			} else if (
				isRectangleIntersectingDiamond(
					{
						x: wall.gapX + this.obstacle.wallGapWidth,
						y: wall.y,
						width: this.canvas.width - wall.gapX - this.obstacle.wallGapWidth,
						height: this.obstacle.wallHeight
					},
					{ cx: this.brick.x, cy: this.brick.y, size: this.brick.diagonalRadius }
				)
			) {
				this.crash();
			}
		}
	}

	crash() {
		this.isGameOver = true;
		document.getElementsByClassName("canvas").item(0)?.classList.add("shake");
	}

	update(delta: number) {
		if (this.isPaused || this.isPausedAtStart) return;
		this.brick.update(delta);
		this.obstacle.update(delta);
		this.handleCollisions();
	}
}
