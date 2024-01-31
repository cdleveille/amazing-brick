import { useCallback, useState } from "react";

import { Canvas } from "@components";
import { Game } from "@game";

export const Play = () => {
	const newGame = useCallback(() => new Game(), []);
	const [game] = useState(newGame);

	return (
		<>
			<Canvas game={game} />
		</>
	);
};
