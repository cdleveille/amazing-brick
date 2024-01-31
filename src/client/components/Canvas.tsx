import { useCallback } from "react";

import { Game, start } from "@game";

interface ICanvasProps {
	game: Game;
}

export const Canvas = ({ game }: ICanvasProps) => {
	const ref = useCallback((canvas: HTMLCanvasElement) => start(canvas, game), []);

	return <canvas ref={ref} />;
};
