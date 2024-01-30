import { brickImg } from "@assets";
import { Header } from "@components";

export const Banner = () => {
	return (
		<div>
			<Header text="AMAZING&nbsp;BRICK" />
			<img src={brickImg} width={200} height={200} alt="Amazing Brick"></img>
		</div>
	);
};
