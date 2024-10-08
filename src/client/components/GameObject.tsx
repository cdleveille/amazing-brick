import { Brick } from "@components";
import { Color } from "@constants";
import { useAppContext } from "@hooks";

export const GameObject = () => {
	const { isDarkMode } = useAppContext();

	return (
		<div
			className="game-object-container"
			style={{ width: "100%", height: "100%", backgroundColor: isDarkMode ? Color.DarkBlue : Color.White }}
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
