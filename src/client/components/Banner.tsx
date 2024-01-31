import { brickImg } from "@assets";

export const Banner = () => {
	return (
		<div>
			<h1>
				<div className="header-outer">
					<div className="header-text">AMAZING</div>
					<div className="header-inner">
						<img src={brickImg} width={80} height={80} alt="Amazing Brick"></img>
						<div className="header-text">BRICK</div>
					</div>
				</div>
			</h1>
		</div>
	);
};
