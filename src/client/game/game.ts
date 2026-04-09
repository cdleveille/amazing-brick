import { Brick } from "@/client/game/brick";
import { Obstacle } from "@/client/game/obstacle";
import { executeOnClass, now } from "@/client/helpers/browser";
import { isRectangleIntersectingDiamond } from "@/client/helpers/game";
import { Color, GameMode } from "@/shared/constants";
import type { TAppContext, TCanvas, TGotchaBrick, TJumpDirection } from "@/shared/types";

export class Game {
  ctx: TAppContext;
  canvas: TCanvas;
  canvasElement: HTMLCanvasElement;
  ctx2d: CanvasRenderingContext2D;
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

  constructor(ctx: TAppContext, canvasElement: HTMLCanvasElement) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.canvasElement = canvasElement;
    const ctx2d = canvasElement.getContext("2d");
    if (!ctx2d) throw new Error("Failed to get 2D canvas context");
    this.ctx2d = ctx2d;
    this.brick = new Brick(this);
    this.obstacle = new Obstacle(this);
    this.gravity = 1500 * this.canvas.scaleRatio;
    if (this.ctx.isGameMode(GameMode.Gotcha)) {
      this.gotchaBricks = [0, 1].map(i => ({
        x: this.generateRandomGotchaBrickX(),
        y:
          -this.obstacle.wallSpacing * (i + 1) -
          this.obstacle.wallHeight / 2 +
          this.obstacle.wallSpacing / 2,
      }));
      this.gotchaBrickWidth = 20 * this.canvas.scaleRatio;
    }
  }

  start() {
    this.ctx.setScore(0);
    this.stopGameLoop = false;
    executeOnClass("canvas", ele => ele.classList.remove("shake"));

    let current: number;
    let last = now();
    let delta: number;
    const maxDelta = 0.1;

    const frame = () => {
      if (this.stopGameLoop) return;
      requestAnimationFrame(frame);
      current = now();
      delta = Math.min((current - last) / 1000, maxDelta);
      this.update(delta);
      this.render();
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
    if (this.ctx.isGameMode(GameMode.Gotcha)) {
      for (const gotchaBrick of this.gotchaBricks) {
        gotchaBrick.x = gotchaBrick.x * resizeRatio;
        gotchaBrick.y = gotchaBrick.y * resizeRatio;
      }
      this.gotchaBrickWidth = this.gotchaBrickWidth * resizeRatio;
    }
    // Update canvas element backing buffer to match new logical dimensions × DPR
    const dpr = window.devicePixelRatio || 1;
    this.canvasElement.width = canvas.width * dpr;
    this.canvasElement.height = canvas.height * dpr;
  }

  handleCollisions() {
    if (this.brick.y <= this.canvas.height / 2) {
      this.brick.y = this.canvas.height / 2;
      this.brick.isCollidingTop = true;
    } else this.brick.isCollidingTop = false;

    if (this.brick.y + this.brick.diagonalRadius >= this.canvas.height) {
      this.crash();
      this.ctx.setScreen("game-over");
    }

    if (this.brick.x - this.brick.diagonalRadius <= 0) {
      this.brick.x = this.brick.diagonalRadius;
      this.brick.xv = 0;
      this.brick.isCollidingLeft = true;
      if (this.brick.yv > 250 * this.canvas.scaleRatio) {
        this.brick.yv = 250 * this.canvas.scaleRatio;
      }
    } else if (this.brick.x + this.brick.diagonalRadius >= this.canvas.width) {
      this.brick.x = this.canvas.width - this.brick.diagonalRadius;
      this.brick.xv = 0;
      this.brick.isCollidingRight = true;
      if (this.brick.yv > 250 * this.canvas.scaleRatio) {
        this.brick.yv = 250 * this.canvas.scaleRatio;
      }
    }

    for (const wall of this.obstacle.walls) {
      if (
        isRectangleIntersectingDiamond(
          {
            x: 0,
            y: wall.y - 1 * this.canvas.scaleRatio,
            width: wall.gapX + 1 * this.canvas.scaleRatio,
            height: this.obstacle.wallHeight + 5 * this.canvas.scaleRatio,
          },
          {
            cx: this.brick.x,
            cy: this.brick.y,
            radius: this.brick.diagonalRadius,
          },
        )
      ) {
        this.crash();
      } else if (
        isRectangleIntersectingDiamond(
          {
            x: wall.gapX + this.obstacle.wallGapWidth - 1 * this.canvas.scaleRatio,
            y: wall.y - 1 * this.canvas.scaleRatio,
            width:
              this.canvas.width -
              wall.gapX -
              this.obstacle.wallGapWidth +
              1 * this.canvas.scaleRatio,
            height: this.obstacle.wallHeight + 5 * this.canvas.scaleRatio,
          },
          { cx: this.brick.x, cy: this.brick.y, radius: this.brick.diagonalRadius },
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
            height: this.obstacle.blockWidth + 5 * this.canvas.scaleRatio,
          },
          { cx: this.brick.x, cy: this.brick.y, radius: this.brick.diagonalRadius },
        )
      ) {
        this.crash();
      }
    }

    if (this.ctx.isGameMode(GameMode.Gotcha) && !this.isGameOver) {
      const gotchaBrickDiagonalWidth = (this.gotchaBrickWidth ** 2 * 2) ** 0.5;
      for (const gotchaBrick of this.gotchaBricks) {
        const isColliding = isRectangleIntersectingDiamond(
          {
            x: gotchaBrick.x - gotchaBrickDiagonalWidth / 2,
            y: gotchaBrick.y - gotchaBrickDiagonalWidth / 2,
            width: gotchaBrickDiagonalWidth,
            height: gotchaBrickDiagonalWidth,
          },
          { cx: this.brick.x, cy: this.brick.y, radius: this.brick.diagonalRadius },
        );
        if (isColliding && gotchaBrick.shrinkTimer === undefined) {
          this.ctx.setScore(score => score + 1);
          gotchaBrick.shrinkTimer = 0.1;
          break;
        }
      }
    }
  }

  crash() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.ctx.submitScore();
    this.brick.startSpin(this.brick.xv);
    executeOnClass("canvas", ele => ele.classList.add("shake"));
  }

  updateGotchaBricks(delta: number) {
    if (this.ctx.gameMode.name !== GameMode.Gotcha) return;
    for (const gotchaBrick of this.gotchaBricks) {
      if (gotchaBrick.shrinkTimer !== undefined) {
        gotchaBrick.shrinkTimer -= delta;
        if (gotchaBrick.shrinkTimer <= 0) {
          delete gotchaBrick.shrinkTimer;
          gotchaBrick.y -= this.obstacle.wallSpacing * 2;
          gotchaBrick.x = this.generateRandomGotchaBrickX();
        }
      }

      if (this.brick.isCollidingTop) {
        gotchaBrick.y -= this.brick.yv * delta;
      }

      if (
        gotchaBrick.shrinkTimer === undefined &&
        gotchaBrick.y + (this.gotchaBrickWidth ** 2 * 2) ** 0.5 / 2 >= this.canvas.height
      ) {
        gotchaBrick.y -= this.obstacle.wallSpacing * 2;
        gotchaBrick.x = this.generateRandomGotchaBrickX();
      }
    }
  }

  update(delta: number) {
    if (this.isPaused || this.isPausedAtStart) return;
    this.brick.update(delta);
    this.obstacle.update(delta);
    this.updateGotchaBricks(delta);
    this.handleCollisions();
  }

  render() {
    const { ctx2d, canvas } = this;
    const dpr = window.devicePixelRatio || 1;

    ctx2d.save();
    ctx2d.scale(dpr, dpr);
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);

    // Draw walls and blocks
    this.obstacle.draw(ctx2d);

    // Draw gotcha bricks (Gotcha mode)
    if (this.ctx.isGameMode(GameMode.Gotcha)) {
      for (const gotchaBrick of this.gotchaBricks) {
        const scale = gotchaBrick.shrinkTimer !== undefined ? gotchaBrick.shrinkTimer / 0.25 : 1;
        this.drawDiamond(
          ctx2d,
          gotchaBrick.x,
          gotchaBrick.y,
          this.gotchaBrickWidth * scale,
          "#f8a502",
        );
      }
    }

    // Draw player brick
    const brickColor = this.ctx.isDarkMode ? Color.White : Color.Black;
    this.brick.draw(ctx2d, brickColor);

    ctx2d.restore();
  }

  private drawDiamond(
    ctx2d: CanvasRenderingContext2D,
    x: number,
    y: number,
    sideLength: number,
    color: string,
  ) {
    ctx2d.save();
    ctx2d.translate(x, y);
    ctx2d.rotate(Math.PI / 4);
    ctx2d.fillStyle = color;
    ctx2d.fillRect(-sideLength / 2, -sideLength / 2, sideLength, sideLength);
    ctx2d.restore();
  }
}
