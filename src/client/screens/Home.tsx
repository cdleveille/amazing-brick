import { Banner, PlayButton, RateButton, ScoresButton } from "@components";
import { GameScreen, Screen } from "@types";

interface IHomeProps {
	setScreen: (screen: GameScreen) => void;
	scaleRatio: number;
	initGame: () => void;
}

export const Home = ({ setScreen, scaleRatio, initGame }: IHomeProps) => {
	const buttonMargin = 20;
	return (
		<div className="home-outer centered">
			<div className="home-inner">
				<Banner scaleRatio={scaleRatio} />
				<div style={{ marginTop: `${60 * scaleRatio}px` }}>
					<RateButton onClick={() => {}} scaleRatio={scaleRatio} margin={buttonMargin} />
					<div className="buttons-row">
						<PlayButton
							onClick={() => {
								initGame();
								setScreen(Screen.Play);
							}}
							scaleRatio={scaleRatio}
							margin={buttonMargin}
						/>
						<ScoresButton
							onClick={() => setScreen(Screen.Scores)}
							scaleRatio={scaleRatio}
							margin={buttonMargin}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
