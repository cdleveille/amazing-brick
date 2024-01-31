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
					<Button backgroundColor={Color.Red} onClick={() => setScreen(Screen.Rate)}>
						RATE
					</Button>
					<div className="home-buttons-lower">
						<Button backgroundColor={Color.Green} onClick={() => setScreen(Screen.Play)}>
							PLAY
						</Button>
						<Button backgroundColor={Color.Blue} onClick={() => setScreen(Screen.Scores)}>
							SCORES
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
