import { Banner, Button } from "@components";
import { Color } from "@types";

export const Home = () => {
	return (
		<div className="home-outer">
			<div className="home-inner">
				<Banner />
				<div className="home-buttons">
					<Button label="RATE" backgroundColor={Color.Red} onClick={() => console.log("rate")} />
					<div className="home-buttons-lower">
						<Button label="PLAY" backgroundColor={Color.Green} onClick={() => console.log("play")} />
						<Button label="SCORES" backgroundColor={Color.Blue} onClick={() => console.log("scores")} />
					</div>
				</div>
			</div>
		</div>
	);
};
