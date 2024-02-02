import { Game } from "@game";
import { JumpDirection } from "@types";

export class InputHandler {
	constructor(canvas: HTMLCanvasElement, game: Game) {
		document.onscroll = e => {
			e.preventDefault();
		};

		document.oncontextmenu = e => {
			e.preventDefault();
		};

		canvas.addEventListener("touchstart", e => {
			e.preventDefault();
			if (e.touches.length > 1) return;
			const touch = e.touches.item(0);
			if (!touch) return;
			const pos = InputHandler.getMouseOrTouchPos(touch, game);
			game.jump(pos.x < game.width / 2 ? JumpDirection.Left : JumpDirection.Right);
		});

		canvas.addEventListener("touchend", e => {
			e.preventDefault();
		});

		canvas.addEventListener("mousedown", e => {
			if (![0, 2].includes(e.button)) return;
			game.jump(e.button === 0 ? JumpDirection.Left : JumpDirection.Right);
		});
	}

	static getMouseOrTouchPos(e: MouseEvent | Touch, game: Game) {
		return { x: e.clientX - game.xOffset, y: e.clientY - game.yOffset };
	}
}
