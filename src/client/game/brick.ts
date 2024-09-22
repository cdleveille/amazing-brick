import { assertGetElementById, Game } from "@game";

import type { TJumpDirection } from "@types";

export class Brick {
	game: Game;
	ele: HTMLElement;
	x: number;
	y: number;
	xv: number;
	yv: number;
	sideLength: number;
	diagonalWidth: number;
	diagonalRadius: number;
	jumpSpeedY: number;
	jumpSpeedX: number;
	isCollidingLeft: boolean;
	isCollidingRight: boolean;
	isCollidingTop: boolean;

	constructor(game: Game) {
		this.game = game;
		this.ele = assertGetElementById("brick");
		this.ele.classList.remove("spin");
		this.x = this.game.canvas.width / 2;
		this.y = this.game.canvas.height / 2;
		this.xv = 0;
		this.yv = 0;
		this.sideLength = 25.75 * this.game.canvas.scaleRatio;
		this.diagonalWidth = (this.sideLength ** 2 * 2) ** 0.5;
		this.diagonalRadius = this.diagonalWidth / 2;
		this.jumpSpeedY = 650 * this.game.canvas.scaleRatio;
		this.jumpSpeedX = 120 * this.game.canvas.scaleRatio;
		this.isCollidingLeft = false;
		this.isCollidingRight = false;
		this.isCollidingTop = true;
		this.resize();
	}

	jump(direction: TJumpDirection) {
		if (this.isCollidingLeft && direction === "left") return;
		if (this.isCollidingRight && direction === "right") return;
		this.yv = -this.jumpSpeedY;
		this.xv = direction === "left" ? -this.jumpSpeedX : this.jumpSpeedX;
		this.isCollidingLeft = false;
		this.isCollidingRight = false;
	}

	resize(resizeRatio = 1) {
		this.x = this.x * resizeRatio;
		this.y = this.y * resizeRatio;
		this.xv = this.xv * resizeRatio;
		this.yv = this.yv * resizeRatio;

		this.sideLength = this.sideLength * resizeRatio;
		this.diagonalWidth = (this.sideLength ** 2 * 2) ** 0.5;
		this.diagonalRadius = this.diagonalWidth / 2;

		this.ele.style.width = `${this.sideLength}px`;
		this.ele.style.height = `${this.sideLength}px`;

		this.jumpSpeedY = this.jumpSpeedY * resizeRatio;
		this.jumpSpeedX = this.jumpSpeedX * resizeRatio;

		this.adjustPosition();
	}

	adjustPosition() {
		this.ele.style.left = `${this.x + (this.diagonalWidth - this.sideLength) / 2 - this.diagonalRadius}px`;
		this.ele.style.top = `${Math.max(this.y + (this.diagonalWidth - this.sideLength) / 2 - this.diagonalRadius, this.game.canvas.height / 2 - (this.diagonalWidth - this.sideLength) / 2 - this.diagonalRadius)}px`;
	}

	update(delta: number) {
		if (this.game.isGameOver) {
			this.xv = 0;
			this.yv = 600 * this.game.canvas.scaleRatio;
			this.ele.classList.add("spin");
		}
		this.yv += this.game.gravity * delta;
		this.x += this.xv * delta;
		this.y += this.yv * delta;
		this.adjustPosition();
	}
}
