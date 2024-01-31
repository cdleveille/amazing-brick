import { brickCroppedImg } from "@assets";

interface IBannerProps {
	scaleRatio: number;
}

export const Banner = ({ scaleRatio }: IBannerProps) => {
	const fontSize = 80 * scaleRatio;
	const brickSize = 60 * scaleRatio;

	return (
		<h1>
			<div className="header-outer">
				<div style={{ fontSize }}>AMAZING</div>
				<div className="header-inner" style={{ marginTop: `${-18 * scaleRatio}px` }}>
					<img src={brickCroppedImg} width={brickSize} height={brickSize} alt="Amazing Brick"></img>
					<div style={{ fontSize, marginLeft: `${10 * scaleRatio}px` }}>BRICK</div>
				</div>
			</div>
		</h1>
	);
};
