import { Color, IResize } from "@types";

export class Game {
	width: number = 0;
	height: number = 0;
	xOffset: number = 0;
	yOffset: number = 0;
	scaleRatio: number = 0;
	setScaleRatio: (scaleRatio: number) => void;
	setOffset: (offset: { xOffset: number; yOffset: number }) => void;

	constructor(
		setScaleRatio: (scaleRatio: number) => void,
		setOffset: (offset: { xOffset: number; yOffset: number }) => void
	) {
		this.setScaleRatio = setScaleRatio;
		this.setOffset = setOffset;
		console.log("new game");
	}

	init() {
		//
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
	}
}
