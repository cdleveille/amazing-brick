import { Brick } from "@components";
import { Color, GameMode } from "@constants";
import { useAppContext } from "@hooks";

export const GameObject = () => {
	const { isDarkMode, gameMode } = useAppContext();

	return (
		<div
			className="game-object-container"
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: isDarkMode ? Color.DarkBlue : Color.White,
				background:
					gameMode.name === GameMode.Shrouded
						? isDarkMode
							? `radial-gradient(circle, ${Color.DarkBlue} 50%, rgba(0,0,0,1) 65%)`
							: `radial-gradient(circle, ${Color.White} -10%, rgba(0,0,0,1) 65%)`
						: ""
			}}
		>
			<div id="wall1-left" className="wall"></div>
			<div id="wall1-right" className="wall"></div>
			<div id="wall2-left" className="wall"></div>
			<div id="wall2-right" className="wall"></div>
			<div id="block1" className="block"></div>
			<div id="block2" className="block"></div>
			<div id="block3" className="block"></div>
			<div id="block4" className="block"></div>
			<Brick id="brick" />
		</div>
	);
};
