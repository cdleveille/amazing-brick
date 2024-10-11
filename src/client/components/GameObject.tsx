import { Brick } from "@components";
import { GameMode } from "@constants";
import { useAppContext, useStyles } from "@hooks";

export const GameObject = () => {
	const { gameMode } = useAppContext();
	const { styles } = useStyles();

	return (
		<div className="game-object-container" style={styles.gameObjectContainer}>
			<div id="wall1-left" className="wall"></div>
			<div id="wall1-right" className="wall"></div>
			<div id="wall2-left" className="wall"></div>
			<div id="wall2-right" className="wall"></div>
			<div id="block1" className="block"></div>
			<div id="block2" className="block"></div>
			<div id="block3" className="block"></div>
			<div id="block4" className="block"></div>
			<Brick id="brick" style={styles.brick} />
			{gameMode.name === GameMode.Gotcha && (
				<>
					<Brick className="gotcha-brick" />
					<Brick className="gotcha-brick" />
				</>
			)}
		</div>
	);
};
