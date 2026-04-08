import type { Game } from "@/client/game/game";
import { type Color, GameMode, OBSTACLE_COLORS } from "@/shared/constants";
import type { TBlock, TWall } from "@/shared/types";

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
        gapX: wall1GapX,
        isScored: false,
        color: OBSTACLE_COLORS[0],
      },
      {
        y: -this.wallHeight - this.wallSpacing,
        gapX: wall2GapX,
        isScored: false,
        color: OBSTACLE_COLORS[0],
      },
    ];
    this.blockWidth = (89 / 1290) * this.game.canvas.width;
    const block4GapX = this.generateRandomGapX();
    this.blocks = [
      {
        x: this.generateRandomBlockX(wall1GapX),
        y: this.walls[0].y - this.wallBlockSpacing - this.blockWidth,
        gapX: wall1GapX,
        color: OBSTACLE_COLORS[0],
      },
      {
        x: this.generateRandomBlockX(wall2GapX),
        y: this.walls[1].y + this.wallHeight + this.wallBlockSpacing,
        gapX: wall2GapX,
        color: OBSTACLE_COLORS[0],
      },
      {
        x: this.generateRandomBlockX(wall2GapX),
        y: this.walls[1].y - this.wallBlockSpacing - this.blockWidth,
        gapX: wall2GapX,
        color: OBSTACLE_COLORS[0],
      },
      {
        x: this.generateRandomBlockX(block4GapX),
        y: this.walls[1].y + this.wallHeight + this.wallBlockSpacing - this.wallSpacing,
        gapX: block4GapX,
        color: OBSTACLE_COLORS[0],
      },
    ];
  }

  generateRandomGapX() {
    return (
      Math.random() *
        (this.game.canvas.width - this.wallGapWidth - 2 * this.wallGapMinDistFromEdge) +
      this.wallGapMinDistFromEdge
    );
  }

  generateRandomBlockX(gapX: number) {
    return Math.random() * (this.wallGapWidth + this.blockWidth) + gapX - this.blockWidth;
  }

  getHighestWall() {
    return this.walls.reduce((highestWall, currentWall) =>
      currentWall.y < highestWall.y ? currentWall : highestWall,
    );
  }

  getHighestBlock() {
    return this.blocks.reduce((highestBlock, currentBlock) =>
      currentBlock.y < highestBlock.y ? currentBlock : highestBlock,
    );
  }

  getNextWallColor(color: Color) {
    const currentWallColorIndex = OBSTACLE_COLORS.indexOf(color);
    const nextWallColorIndex =
      currentWallColorIndex + 1 >= OBSTACLE_COLORS.length ? 0 : currentWallColorIndex + 1;
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

      if (
        wall.y > this.game.canvas.height / 2 + this.game.brick.diagonalRadius &&
        !wall.isScored &&
        this.game.ctx.gameMode.name !== GameMode.Gotcha
      ) {
        wall.isScored = true;
        this.game.ctx.setScore(score => score + 1);
        if (this.game.ctx.isGameMode(GameMode.Sprint)) {
          this.game.ctx.setNetStartTime(time => time + 1250);
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
    }

    for (const block of this.blocks) {
      if (this.game.brick.isCollidingTop) {
        block.y -= this.game.brick.yv * delta;
      }

      if (block.y >= this.game.canvas.height) {
        block.y -= this.wallSpacing * 2;
        const index = this.blocks.indexOf(block);
        if (index === 0) {
          block.gapX = this.walls[0].gapX;
        } else if (index === 2) {
          block.gapX = this.walls[1].gapX;
        } else {
          block.gapX = this.generateRandomGapX();
        }
        block.x = this.generateRandomBlockX(block.gapX);
        block.color = this.obstacleColor;
      }
    }
  }

  draw(ctx2d: CanvasRenderingContext2D) {
    const { canvas } = this.game;

    for (const wall of this.walls) {
      ctx2d.fillStyle = wall.color;
      // Left wall segment
      if (wall.gapX > 0) {
        ctx2d.fillRect(0, wall.y, wall.gapX, this.wallHeight);
      }
      // Right wall segment
      const rightStart = wall.gapX + this.wallGapWidth;
      const rightWidth = canvas.width - rightStart;
      if (rightWidth > 0) {
        ctx2d.fillRect(rightStart, wall.y, rightWidth, this.wallHeight);
      }
    }

    for (const block of this.blocks) {
      ctx2d.fillStyle = block.color;
      ctx2d.fillRect(block.x, block.y, this.blockWidth, this.blockWidth);
    }
  }
}
