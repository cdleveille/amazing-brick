import { Color, WALL_COLORS } from "@constants";
import { assertGetElementById, Game } from "@game";

import type { TWall } from "@types";

export class Obstacle {
	game: Game;
	walls: TWall[];
	wallSpacing: number;
	wallHeight: number;
	wallGapWidth: number;
	wallGapMinDistFromEdge: number;
	wallBlockSpacing: number;
	wallColor: Color;
	wallCount: number;

	constructor(game: Game) {
		this.game = game;
		this.wallSpacing = (1313 / 2294) * this.game.canvas.height;
		this.wallHeight = (132 / 2294) * this.game.canvas.height;
		this.wallGapWidth = this.game.canvas.width * (447 / 1290);
		this.wallGapMinDistFromEdge = this.wallGapWidth / 3;
		this.wallBlockSpacing = (233 / 2294) * this.game.canvas.height;
		this.wallColor = WALL_COLORS[0];
		this.wallCount = 1;
		this.walls = [
			{
				y: -this.wallHeight,
				eleLeft: assertGetElementById("wall1-left"),
				eleRight: assertGetElementById("wall1-right"),
				gapX: this.getWallGapX(),
				isScored: false,
				color: WALL_COLORS[0]
			},
			{
				y: -this.wallHeight - this.wallSpacing,
				eleLeft: assertGetElementById("wall2-left"),
				eleRight: assertGetElementById("wall2-right"),
				gapX: this.getWallGapX(),
				isScored: false,
				color: WALL_COLORS[0]
			}
		];
		for (const wall of this.walls) {
			wall.eleLeft.style.height = "0px";
			wall.eleRight.style.height = "0px";
		}
	}

	getWallGapX() {
		return (
			Math.random() * (this.game.canvas.width - this.wallGapWidth - 2 * this.wallGapMinDistFromEdge) +
			this.wallGapMinDistFromEdge
		);
	}

	getNextWallColor(color: Color) {
		const currentWallColorIndex = WALL_COLORS.indexOf(color);
		const nextWallColorIndex = currentWallColorIndex + 1 >= WALL_COLORS.length ? 0 : currentWallColorIndex + 1;
		return WALL_COLORS[nextWallColorIndex];
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

			wall.eleLeft.style.backgroundColor = wall.color;
			wall.eleRight.style.backgroundColor = wall.color;

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
				this.wallCount += 1;
				if (this.wallCount % 5 === 0) {
					this.wallColor = this.getNextWallColor(this.wallColor);
				}
				wall.color = this.wallColor;
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
