import { brickImg } from "@assets";

export const Banner = () => {
	return (
		<h1>
			<div className="header-outer">
				<div>AMAZING</div>
				<div className="header-inner">
					<img src={brickImg} width={80} height={80} alt="Amazing Brick"></img>
					<div>BRICK</div>
				</div>
			</div>
		</h1>
	);
};
