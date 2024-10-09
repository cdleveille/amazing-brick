import { GameMode } from "@constants";
import { Brick, isRectangleIntersectingDiamond, now, Obstacle } from "@game";

import type { TAppContext, TCanvas, TJumpDirection, TGotchaBrick } from "@types";

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
	gotchaBricks = [] as TGotchaBrick[];
	gotchaBrickWidth = 0;

	constructor(ctx: TAppContext) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.brick = new Brick(this);
		this.obstacle = new Obstacle(this);
		this.gravity = 1500 * this.canvas.scaleRatio;
		if (this.ctx.gameMode.name === GameMode.Gotcha) {
			this.gotchaBricks = Array.from(document.getElementsByClassName("gotcha-brick")).map((ele, i) => {
				return {
					x: this.generateRandomGotchaBrickX(),
					y:
						-this.obstacle.wallSpacing * (i + 1) -
						this.obstacle.wallHeight / 2 +
						this.obstacle.wallSpacing / 2,
					ele: ele as HTMLElement
				} as TGotchaBrick;
			});
			this.gotchaBrickWidth = 20 * this.canvas.scaleRatio;
		}
	}

	start() {
		this.ctx.setScore(0);
		this.stopGameLoop = false;
		document.getElementsByClassName("canvas").item(0)?.classList.remove("shake");
		let current: number,
			last = now(),
			delta: number;
		const frame = () => {
			if (this.stopGameLoop) return;
			current = now();
			delta = (current - last) / 1000;
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

	generateRandomGotchaBrickX() {
		const margin = 25 * this.canvas.scaleRatio;
		return Math.random() * (this.canvas.width - margin * 2) + margin;
	}

	jump(direction: TJumpDirection) {
		if (this.isPaused) return;
		if (this.isGameOver) return;
		if (this.isPausedAtStart) {
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
		if (this.ctx.gameMode.name === GameMode.Gotcha) {
			for (const gotchaBrick of this.gotchaBricks) {
				gotchaBrick.x = gotchaBrick.x * resizeRatio;
				gotchaBrick.y = gotchaBrick.y * resizeRatio;
			}
			this.gotchaBrickWidth = this.gotchaBrickWidth * resizeRatio;
			this.adjustGotchaBrickPosition();
		}
	}

	handleCollisions() {
		if (this.brick.y <= this.canvas.height / 2) {
			this.brick.y = this.canvas.height / 2;
			this.brick.isCollidingTop = true;
		} else this.brick.isCollidingTop = false;

		if (this.brick.y + this.brick.diagonalRadius >= this.canvas.height) {
			this.ctx.setScreen("game-over");
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
					{
						x: 0,
						y: wall.y - 1 * this.canvas.scaleRatio,
						width: wall.gapX + 1 * this.canvas.scaleRatio,
						height: this.obstacle.wallHeight + 5 * this.canvas.scaleRatio
					},
					{
						cx: this.brick.x,
						cy: this.brick.y,
						size: this.brick.diagonalRadius
					}
				)
			) {
				this.crash();
			} else if (
				isRectangleIntersectingDiamond(
					{
						x: wall.gapX + this.obstacle.wallGapWidth - 1 * this.canvas.scaleRatio,
						y: wall.y - 1 * this.canvas.scaleRatio,
						width: this.canvas.width - wall.gapX - this.obstacle.wallGapWidth + 1 * this.canvas.scaleRatio,
						height: this.obstacle.wallHeight + 5 * this.canvas.scaleRatio
					},
					{ cx: this.brick.x, cy: this.brick.y, size: this.brick.diagonalRadius }
				)
			) {
				this.crash();
			}
		}

		for (const block of this.obstacle.blocks) {
			if (
				isRectangleIntersectingDiamond(
					{
						x: block.x,
						y: block.y,
						width: this.obstacle.blockWidth,
						height: this.obstacle.blockWidth + 5 * this.canvas.scaleRatio
					},
					{ cx: this.brick.x, cy: this.brick.y, size: this.brick.diagonalRadius }
				)
			) {
				this.crash();
			}
		}

		if (this.ctx.gameMode.name === GameMode.Gotcha && !this.isGameOver) {
			const gotchaBrickDiagonalWidth = (this.gotchaBrickWidth ** 2 * 2) ** 0.5;
			for (const gotchaBrick of this.gotchaBricks) {
				const isColliding = isRectangleIntersectingDiamond(
					{
						x: gotchaBrick.x - gotchaBrickDiagonalWidth / 2,
						y: gotchaBrick.y - gotchaBrickDiagonalWidth / 2,
						width: gotchaBrickDiagonalWidth,
						height: gotchaBrickDiagonalWidth
					},
					{ cx: this.brick.x, cy: this.brick.y, size: this.brick.diagonalRadius }
				);
				if (isColliding) {
					this.ctx.setScore(score => score + 1);
					gotchaBrick.y -= this.obstacle.wallSpacing * 2;
					gotchaBrick.x = this.generateRandomGotchaBrickX();
					break;
				}
			}
		}
	}

	crash() {
		this.brick.ele.classList.add("spin");
		this.isGameOver = true;
		document.getElementsByClassName("canvas").item(0)?.classList.add("shake");
	}

	adjustGotchaBrickPosition() {
		if (this.ctx.gameMode.name !== GameMode.Gotcha) return;
		for (const gotchaBrick of this.gotchaBricks) {
			gotchaBrick.ele.style.top = `${gotchaBrick.y - this.gotchaBrickWidth / 2}px`;
			gotchaBrick.ele.style.left = `${gotchaBrick.x - this.gotchaBrickWidth / 2}px`;
		}
	}

	updateGotchaBricks(delta: number) {
		if (this.ctx.gameMode.name !== GameMode.Gotcha) return;
		for (const gotchaBrick of this.gotchaBricks) {
			if (this.brick.isCollidingTop) {
				gotchaBrick.y -= this.brick.yv * delta;
			}

			gotchaBrick.ele.style.width = `${this.gotchaBrickWidth}px`;
			gotchaBrick.ele.style.height = `${this.gotchaBrickWidth}px`;

			if (gotchaBrick.y + (this.gotchaBrickWidth ** 2 * 2) ** 0.5 / 2 >= this.canvas.height) {
				gotchaBrick.y -= this.obstacle.wallSpacing * 2;
				gotchaBrick.x = this.generateRandomGotchaBrickX();
			}

			this.adjustGotchaBrickPosition();
		}
	}

	update(delta: number) {
		if (this.isPaused || this.isPausedAtStart) return;
		this.brick.update(delta);
		this.obstacle.update(delta);
		this.updateGotchaBricks(delta);
		this.handleCollisions();
	}
}
