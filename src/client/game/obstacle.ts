import { Game } from "@game";
import { Color, IObstacleBar } from "@types";

export class Obstacle {
	game: Game;
	bars: IObstacleBar[];

	constructor(game: Game) {
		this.game = game;
		this.bars = [{ y: 0 }, { y: -500 }, { y: -1000 }, { y: -1500 }];
	}

	resize(scaleRatio: number) {
		for (const bar of this.bars) {
			bar.y *= scaleRatio;
		}
	}

	update(delta: number) {
		if (!this.game.isStarted) return;
		if (!this.game.brick.isHalfwayUp) return;

		for (const bar of this.bars) {
			bar.y -= this.game.brick.yv * delta;
		}
	}

	draw(ctx: CanvasRenderingContext2D, xOffset: number, yOffset: number) {
		if (!this.game.isStarted) return;
		const heightScaled = this.game.height * (134 / 2290);
		for (const bar of this.bars) {
			ctx.fillStyle = Color.Blue;
			const barHeight =
				bar.y + heightScaled < yOffset
					? 0
					: bar.y + heightScaled + yOffset > this.game.height + yOffset
						? this.game.height - bar.y
						: Math.min(bar.y + heightScaled - yOffset, heightScaled);
			const barY = Math.max(yOffset, bar.y);
			ctx.fillRect(xOffset, barY, this.game.width, barHeight);
		}
	}
}
