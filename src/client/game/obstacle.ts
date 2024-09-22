import { assertGetElementById, Game } from "@game";

import type { TWall } from "@types";

export class Obstacle {
	game: Game;
	walls: TWall[];
	wallSpacing: number;
	wallHeight: number;

	constructor(game: Game) {
		this.game = game;
		this.wallSpacing = (1313 / 2294) * this.game.canvas.height;
		this.wallHeight = 45 * this.game.canvas.scaleRatio;
		this.walls = [
			{ y: -this.wallHeight, ele: assertGetElementById("wall1") },
			{ y: -this.wallHeight - this.wallSpacing, ele: assertGetElementById("wall2") }
		];
	}

	resize(resizeRatio: number) {
		this.wallSpacing = this.wallSpacing * resizeRatio;
		this.wallHeight = this.wallHeight * resizeRatio;
		for (const wall of this.walls) {
			wall.y = wall.y * resizeRatio;
		}
	}

	update(delta: number) {
		for (const wall of this.walls) {
			if (this.game.brick.isCollidingTop) {
				wall.y -= this.game.brick.yv * delta;
			}

			wall.ele.style.width = `${this.game.canvas.width}px`;
			wall.ele.style.top = `${Math.max(0, wall.y)}px`;

			if (wall.y > this.game.canvas.height) wall.y -= this.wallSpacing * 2;

			if (wall.y < 0) {
				wall.ele.style.height = `${Math.ceil(Math.max(0, this.wallHeight + wall.y))}px`;
			} else {
				wall.ele.style.height = `${Math.ceil(Math.min(this.wallHeight, this.game.canvas.height - wall.y))}px`;
			}
		}
	}
}
