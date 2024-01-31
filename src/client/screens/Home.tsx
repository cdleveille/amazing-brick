import { Banner, Button } from "@components";
import { Color, GameScreen, Screen } from "@types";

interface IHomeProps {
	setScreen: (screen: GameScreen) => void;
}

export const Home = ({ setScreen }: IHomeProps) => {
	return (
		<div className="home-outer">
			<div className="home-inner">
				<Banner />
				<div className="home-buttons">
					<Button label="RATE" backgroundColor={Color.Red} onClick={() => setScreen(Screen.Rate)} />
					<div className="home-buttons-lower">
						<Button label="PLAY" backgroundColor={Color.Green} onClick={() => setScreen(Screen.Play)} />
						<Button label="SCORES" backgroundColor={Color.Blue} onClick={() => setScreen(Screen.Scores)} />
					</div>
				</div>
			</div>
		</div>
	);
};
