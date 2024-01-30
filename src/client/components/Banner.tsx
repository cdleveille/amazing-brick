import { brickImg } from "@assets";
import { Header } from "@components";

interface IBannerProps {
	width?: number;
	height?: number;
}

export const Banner = ({ width, height }: IBannerProps) => {
	return (
		<div className="hello centered">
			<Header text="AMAZING&nbsp;BRICK" />
			<img src={brickImg} width={width} height={height} alt="Amazing Brick"></img>
		</div>
	);
};
