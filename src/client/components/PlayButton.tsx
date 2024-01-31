import { playImg } from "@assets";
import { Button } from "@components";
import { Color } from "@types";

interface IPlayButtonProps {
	onClick: () => void;
	scaleRatio: number;
	margin?: number;
}

export const PlayButton = ({ onClick, scaleRatio, margin }: IPlayButtonProps) => {
	const iconSize = 32 * scaleRatio;
	return (
		<Button backgroundColor={Color.Green} onClick={onClick} scaleRatio={scaleRatio} margin={margin}>
			<img src={playImg} width={iconSize} height={iconSize} alt="Play"></img>
		</Button>
	);
};
