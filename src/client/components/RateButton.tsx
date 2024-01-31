import { Button } from "@components";
import { Color } from "@types";

interface IRateButtonProps {
	onClick: () => void;
	scaleRatio: number;
	margin?: number;
}

export const RateButton = ({ onClick, scaleRatio, margin }: IRateButtonProps) => {
	return (
		<Button backgroundColor={Color.Red} onClick={onClick} scaleRatio={scaleRatio} margin={margin}>
			RATE
		</Button>
	);
};
