import { assertGetElementById, Game } from "@game";

import type { TWall } from "@types";

export class Obstacle {
	game: Game;
	walls: TWall[];
	wallSpacing: number;
	wallHeight: number;
	wallGapWidth: number;
	wallGapMinDistFromEdge: number;

	constructor(game: Game) {
		this.game = game;
		this.wallSpacing = (1313 / 2294) * this.game.canvas.height;
		this.wallHeight = (132 / 2294) * this.game.canvas.height;
		this.wallGapWidth = this.game.canvas.width * (447 / 1290);
		this.wallGapMinDistFromEdge = this.wallGapWidth / 3;
		this.walls = [
			{
				y: -this.wallHeight,
				eleLeft: assertGetElementById("wall1-left"),
				eleRight: assertGetElementById("wall1-right"),
				gapX: this.getWallGapX(),
				isScored: false
			},
			{
				y: -this.wallHeight - this.wallSpacing,
				eleLeft: assertGetElementById("wall2-left"),
				eleRight: assertGetElementById("wall2-right"),
				gapX: this.getWallGapX(),
				isScored: false
			}
		];
	}

	getWallGapX() {
		return (
			Math.random() * (this.game.canvas.width - this.wallGapWidth - 2 * this.wallGapMinDistFromEdge) +
			this.wallGapMinDistFromEdge
		);
	}

	resize(resizeRatio: number) {
		this.wallSpacing = this.wallSpacing * resizeRatio;
		this.wallHeight = this.wallHeight * resizeRatio;
		this.wallGapWidth = this.wallGapWidth * resizeRatio;
		this.wallGapMinDistFromEdge = this.wallGapWidth / 3;
		for (const wall of this.walls) {
			wall.y = wall.y * resizeRatio;
			wall.gapX = wall.gapX * resizeRatio;
		}
	}

	update(delta: number) {
		for (const wall of this.walls) {
			if (this.game.brick.isCollidingTop) {
				wall.y -= this.game.brick.yv * delta;
			}

			wall.eleLeft.style.width = `${wall.gapX}px`;
			wall.eleLeft.style.top = `${Math.max(0, wall.y)}px`;

			wall.eleRight.style.width = `${this.game.canvas.width - wall.gapX - this.wallGapWidth}px`;
			wall.eleRight.style.top = `${Math.max(0, wall.y)}px`;
			wall.eleRight.style.left = `${wall.gapX + this.wallGapWidth}px`;

			if (wall.y > this.game.canvas.height / 2 + this.game.brick.diagonalRadius && !wall.isScored) {
				wall.isScored = true;
				this.game.ctx.setScore(score => score + 1);
			}

			if (wall.y > this.game.canvas.height) {
				wall.y -= this.wallSpacing * 2;
				wall.gapX = this.getWallGapX();
				wall.isScored = false;
			}

			if (wall.y < 0) {
				wall.eleLeft.style.height = `${Math.ceil(Math.max(0, this.wallHeight + wall.y))}px`;
				wall.eleRight.style.height = `${Math.ceil(Math.max(0, this.wallHeight + wall.y))}px`;
			} else {
				wall.eleLeft.style.height = `${Math.ceil(Math.min(this.wallHeight, this.game.canvas.height - wall.y))}px`;
				wall.eleRight.style.height = `${Math.ceil(Math.min(this.wallHeight, this.game.canvas.height - wall.y))}px`;
			}
		}
	}
}
