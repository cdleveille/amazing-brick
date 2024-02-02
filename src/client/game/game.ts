import { jumpImg } from "@assets";
import { Brick } from "@game";
import { Color, IResize, JumpDirection } from "@types";

import { loadImage } from "./util";

const jumpImgLoaded = loadImage(jumpImg);

export class Game {
	width = 0;
	height = 0;
	xOffset = 0;
	yOffset = 0;
	scaleRatio = 0;
	setScaleRatio: (scaleRatio: number) => void;
	setOffset: (offset: { xOffset: number; yOffset: number }) => void;
	brick = new Brick(this);
	isStarted = false;
	showJumpImage = false;

	constructor(
		setScaleRatio: (scaleRatio: number) => void,
		setOffset: (offset: { xOffset: number; yOffset: number }) => void
	) {
		this.setScaleRatio = setScaleRatio;
		this.setOffset = setOffset;
	}

	init() {
		this.brick.x = this.width / 2;
		this.brick.y = this.height / 2 - this.brick.size / 2;
		this.showJumpImage = true;
	}

	resize(screen: IResize) {
		this.width = screen.width;
		this.height = screen.height;
		this.xOffset = screen.xOffset;
		this.yOffset = screen.yOffset;
		this.scaleRatio = this.height / 924;
		this.brick.resize(this.width, 103 / 1290, this.scaleRatio);
		this.setScaleRatio(this.scaleRatio);
		this.setOffset({ xOffset: this.xOffset, yOffset: this.yOffset });
	}

	jump(direction: JumpDirection) {
		if (!this.isStarted) {
			this.isStarted = true;
			this.showJumpImage = false;
		}
		this.brick.jump(direction, this.scaleRatio);
	}

	handleCollisions() {
		// touching wall
		if (this.brick.x - this.brick.size / 2 <= 0) {
			this.brick.x = this.brick.size / 2;
			this.brick.xv = 0;
			this.brick.isTouchingWall = true;
		} else if (this.brick.x + this.brick.size / 2 >= this.width) {
			this.brick.x = this.width - this.brick.size / 2;
			this.brick.xv = 0;
			this.brick.isTouchingWall = true;
		} else {
			this.brick.isTouchingWall = false;
		}

		// touching floor
		if (this.brick.y + this.brick.size / 2 > this.height) {
			this.brick.y = this.height - this.brick.size / 2;
			this.brick.yv = 0;
		}
	}

	update(delta: number) {
		this.brick.update(delta, this.isStarted, this.scaleRatio);
		this.handleCollisions();
	}

	draw(ctx: CanvasRenderingContext2D) {
		// black background
		ctx.fillStyle = Color.Black;
		ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

		// white game screen
		ctx.fillStyle = Color.White;
		ctx.fillRect(this.xOffset, this.yOffset, this.width, this.height);

		// draw brick
		this.brick.draw(ctx, this.scaleRatio, this.xOffset, this.yOffset);

		// jump image
		if (this.showJumpImage) {
			const imgWidth = 298.737747 * this.scaleRatio;
			const imgHeight = 141.6416078 * this.scaleRatio;
			ctx.drawImage(
				jumpImgLoaded,
				this.xOffset + this.width / 2 - imgWidth / 2,
				this.yOffset + this.height / 2 - imgHeight - 50 * this.scaleRatio,
				imgWidth,
				imgHeight
			);
		}
	}
}
