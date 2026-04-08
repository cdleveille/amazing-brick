import type { Game } from "@/client/game/game";
import type { TJumpDirection } from "@/shared/types";

export class Brick {
  game: Game;
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
  isSpinning: boolean;
  spinAngle: number;

  constructor(game: Game) {
    this.game = game;
    this.x = this.game.canvas.width / 2;
    this.y = this.game.canvas.height / 2;
    this.xv = 0;
    this.yv = 0;
    this.sideLength = 25.75 * this.game.canvas.scaleRatio;
    this.diagonalWidth = (this.sideLength ** 2 * 2) ** 0.5;
    this.diagonalRadius = this.diagonalWidth / 2;
    this.jumpSpeedY = 700 * this.game.canvas.scaleRatio;
    this.jumpSpeedX = 120 * this.game.canvas.scaleRatio;
    this.isCollidingLeft = false;
    this.isCollidingRight = false;
    this.isCollidingTop = true;
    this.isSpinning = false;
    this.spinAngle = 0;
    this.resize();
  }

  startSpin() {
    this.isSpinning = true;
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

    this.jumpSpeedY = this.jumpSpeedY * resizeRatio;
    this.jumpSpeedX = this.jumpSpeedX * resizeRatio;
  }

  update(delta: number) {
    if (this.game.isGameOver) {
      this.xv = 0;
      this.yv = 550 * this.game.canvas.scaleRatio;
    } else {
      this.yv += this.game.gravity * delta;
    }

    this.x += this.xv * delta;
    this.y += this.yv * delta;

    // Match CSS spin animation: spin 4s linear infinite, 0deg → -1440deg = -1 revolution/second
    if (this.isSpinning) {
      this.spinAngle -= 2 * Math.PI * delta;
    }
  }

  draw(ctx2d: CanvasRenderingContext2D, color: string) {
    ctx2d.save();
    ctx2d.translate(this.x, this.y);
    // Base 45° rotation gives diamond appearance; spinAngle adds the crash spin
    ctx2d.rotate(Math.PI / 4 + this.spinAngle);
    ctx2d.fillStyle = color;
    ctx2d.fillRect(-this.sideLength / 2, -this.sideLength / 2, this.sideLength, this.sideLength);
    ctx2d.restore();
  }
}
