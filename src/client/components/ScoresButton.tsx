import { scoresImg } from "@assets";
import { Button } from "@components";
import { Color } from "@types";

interface IScoresButtonProps {
	onClick: () => void;
	scaleRatio: number;
	margin?: number;
}

export const ScoresButton = ({ onClick, scaleRatio, margin }: IScoresButtonProps) => {
	const iconSize = 32 * scaleRatio;
	return (
		<Button backgroundColor={Color.Blue} onClick={onClick} scaleRatio={scaleRatio} margin={margin}>
			<img src={scoresImg} width={iconSize} height={iconSize} alt="Scores"></img>
		</Button>
	);
};
