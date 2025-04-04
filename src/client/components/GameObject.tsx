import { Brick } from "@components";
import { GameMode } from "@constants";
import { useAppContext, useStyles } from "@hooks";

export const GameObject = () => {
	const { isGameMode } = useAppContext();
	const { styles } = useStyles();

	return (
		<>
			<div id="wall1-left" className="wall"></div>
			<div id="wall1-right" className="wall"></div>
			<div id="wall2-left" className="wall"></div>
			<div id="wall2-right" className="wall"></div>
			<div id="block1" className="block"></div>
			<div id="block2" className="block"></div>
			<div id="block3" className="block"></div>
			<div id="block4" className="block"></div>
			{isGameMode(GameMode.Gotcha) && (
				<>
					<Brick className="gotcha-brick" />
					<Brick className="gotcha-brick" />
				</>
			)}
			{isGameMode(GameMode.Shrouded) && <div className="absolute-center" style={styles.shroud}></div>}
			<Brick id="brick" style={styles.brick} />
		</>
	);
};
