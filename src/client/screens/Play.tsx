import { useCallback } from "react";

import { Canvas } from "@components";
import { Game } from "@game";

export const Play = () => {
	const game = useCallback(() => new Game(), []);

	return <Canvas game={game()} />;
};
