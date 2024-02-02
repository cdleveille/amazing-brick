import { Brick } from "@game";
import { Color, IResize } from "@types";

export class Game {
	width = 0;
	height = 0;
	xOffset = 0;
	yOffset = 0;
	scaleRatio = 0;
	setScaleRatio: (scaleRatio: number) => void;
	setOffset: (offset: { xOffset: number; yOffset: number }) => void;
	brick = new Brick();

	constructor(
		setScaleRatio: (scaleRatio: number) => void,
		setOffset: (offset: { xOffset: number; yOffset: number }) => void
	) {
		this.setScaleRatio = setScaleRatio;
		this.setOffset = setOffset;
	}

	init() {
		this.brick.x = this.width / 2;
		this.brick.y = (3 * this.height) / 4;
	}

	resize(screen: IResize) {
		this.width = screen.width;
		this.height = screen.height;
		this.xOffset = screen.xOffset;
		this.yOffset = screen.yOffset;
		this.scaleRatio = this.height / 924;
		this.setScaleRatio(this.scaleRatio);
		this.setOffset({ xOffset: this.xOffset, yOffset: this.yOffset });
	}

	update(delta: number) {
		console.log(delta);
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
	}
}
