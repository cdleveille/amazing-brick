import { Color, GameMode, OBSTACLE_COLORS } from "@constants";
import { assertGetElementById, Game } from "@game";

import type { TWall, TBlock } from "@types";

export class Obstacle {
	game: Game;
	wallSpacing: number;
	wallHeight: number;
	wallGapWidth: number;
	wallGapMinDistFromEdge: number;
	wallBlockSpacing: number;
	obstacleColor: Color;
	wallCount: number;
	walls: TWall[];
	blockWidth: number;
	blocks: TBlock[];

	constructor(game: Game) {
		this.game = game;
		this.wallSpacing = (1313 / 2294) * this.game.canvas.height;
		this.wallHeight = (132 / 2294) * this.game.canvas.height;
		this.wallGapWidth = (447 / 1290) * this.game.canvas.width;
		this.wallGapMinDistFromEdge = this.wallGapWidth / 3;
		this.wallBlockSpacing = (233 / 2294) * this.game.canvas.height;
		this.obstacleColor = OBSTACLE_COLORS[0];
		this.wallCount = 1;
		const wall1GapX = this.generateRandomGapX();
		const wall2GapX = this.generateRandomGapX();
		this.walls = [
			{
				y: -this.wallHeight,
				eleLeft: assertGetElementById("wall1-left"),
				eleRight: assertGetElementById("wall1-right"),
				gapX: wall1GapX,
				isScored: false,
				color: OBSTACLE_COLORS[0]
			},
			{
				y: -this.wallHeight - this.wallSpacing,
				eleLeft: assertGetElementById("wall2-left"),
				eleRight: assertGetElementById("wall2-right"),
				gapX: wall2GapX,
				isScored: false,
				color: OBSTACLE_COLORS[0]
			}
		];
		this.blockWidth = (89 / 1290) * this.game.canvas.width;
		const block4GapX = this.generateRandomGapX();
		this.blocks = [
			{
				x: this.generateRandomBlockX(wall1GapX),
				y: this.walls[0].y - this.wallBlockSpacing - this.blockWidth,
				ele: assertGetElementById("block1"),
				gapX: wall1GapX,
				color: OBSTACLE_COLORS[0]
			},
			{
				x: this.generateRandomBlockX(wall2GapX),
				y: this.walls[1].y + this.wallHeight + this.wallBlockSpacing,
				ele: assertGetElementById("block2"),
				gapX: wall2GapX,
				color: OBSTACLE_COLORS[0]
			},
			{
				x: this.generateRandomBlockX(wall2GapX),
				y: this.walls[1].y - this.wallBlockSpacing - this.blockWidth,
				ele: assertGetElementById("block3"),
				gapX: wall2GapX,
				color: OBSTACLE_COLORS[0]
			},
			{
				x: this.generateRandomBlockX(block4GapX),
				y: this.walls[1].y + this.wallHeight + this.wallBlockSpacing - this.wallSpacing,
				ele: assertGetElementById("block4"),
				gapX: block4GapX,
				color: OBSTACLE_COLORS[0]
			}
		];
	}

	generateRandomGapX() {
		return (
			Math.random() * (this.game.canvas.width - this.wallGapWidth - 2 * this.wallGapMinDistFromEdge) +
			this.wallGapMinDistFromEdge
		);
	}

	generateRandomBlockX(gapX: number) {
		return Math.random() * (this.wallGapWidth + this.blockWidth) + gapX - this.blockWidth;
	}

	getHighestWall() {
		return this.walls.reduce((highestWall, currentWall) =>
			currentWall.y < highestWall.y ? currentWall : highestWall
		);
	}

	getHighestBlock() {
		return this.blocks.reduce((highestBlock, currentBlock) =>
			currentBlock.y < highestBlock.y ? currentBlock : highestBlock
		);
	}

	getNextWallColor(color: Color) {
		const currentWallColorIndex = OBSTACLE_COLORS.indexOf(color);
		const nextWallColorIndex = currentWallColorIndex + 1 >= OBSTACLE_COLORS.length ? 0 : currentWallColorIndex + 1;
		return OBSTACLE_COLORS[nextWallColorIndex];
	}

	resize(resizeRatio: number) {
		this.wallSpacing = this.wallSpacing * resizeRatio;
		this.wallHeight = this.wallHeight * resizeRatio;
		this.wallGapWidth = this.wallGapWidth * resizeRatio;
		this.wallGapMinDistFromEdge = this.wallGapWidth / 3;
		this.blockWidth = this.blockWidth * resizeRatio;
		for (const wall of this.walls) {
			wall.y = wall.y * resizeRatio;
			wall.gapX = wall.gapX * resizeRatio;
		}
		for (const block of this.blocks) {
			block.x = block.x * resizeRatio;
			block.y = block.y * resizeRatio;
			block.gapX = block.gapX * resizeRatio;
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
				if (this.game.ctx.gameMode.name === GameMode.Sprint) {
					this.game.ctx.setNetStartTime(time => time + 1200);
				}
			}

			if (wall.y >= this.game.canvas.height) {
				this.wallCount += 1;
				wall.y -= this.wallSpacing * 2;
				wall.gapX = this.getHighestBlock().gapX;
				wall.isScored = false;
				if (this.wallCount % 5 === 0) {
					this.obstacleColor = this.getNextWallColor(this.obstacleColor);
				}
				wall.color = this.obstacleColor;
			}

			if (wall.y < 0) {
				wall.eleLeft.style.height = `${Math.ceil(Math.max(0, this.wallHeight + wall.y))}px`;
				wall.eleRight.style.height = `${Math.ceil(Math.max(0, this.wallHeight + wall.y))}px`;
			} else if (wall.y >= this.game.canvas.height) {
				wall.eleLeft.style.height = "0px";
				wall.eleRight.style.height = "0px";
			} else {
				wall.eleLeft.style.height = `${Math.ceil(Math.min(this.wallHeight, this.game.canvas.height - wall.y))}px`;
				wall.eleRight.style.height = `${Math.ceil(Math.min(this.wallHeight, this.game.canvas.height - wall.y))}px`;
			}
		}

		for (const block of this.blocks) {
			if (this.game.brick.isCollidingTop) {
				block.y -= this.game.brick.yv * delta;
			}

			block.ele.style.backgroundColor = block.color;
			block.ele.style.width = `${this.blockWidth}px`;
			block.ele.style.top = `${Math.max(0, block.y)}px`;
			block.ele.style.left = `${block.x}px`;

			if (block.y >= this.game.canvas.height) {
				block.y -= this.wallSpacing * 2;
				const id = block.ele.id;
				if (id === "block1") {
					block.gapX = this.walls[0].gapX;
				} else if (id === "block3") {
					block.gapX = this.walls[1].gapX;
				} else {
					block.gapX = this.generateRandomGapX();
				}
				block.x = this.generateRandomBlockX(block.gapX);
				block.color = this.obstacleColor;
			}

			if (block.y < 0) {
				block.ele.style.height = `${Math.ceil(Math.max(0, this.blockWidth + block.y))}px`;
			} else if (block.y >= this.game.canvas.height) {
				block.ele.style.height = "0px";
			} else {
				block.ele.style.height = `${Math.ceil(Math.min(this.blockWidth, this.game.canvas.height - block.y))}px`;
			}
		}
	}
}
