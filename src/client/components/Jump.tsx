import { useAppContext } from "@hooks";

type JumpProps = {
	style?: React.CSSProperties;
};

export const Jump = ({ style }: JumpProps) => {
	const {
		canvas: { scaleRatio }
	} = useAppContext();

	return <img src="./assets/jump.svg" width={250 * scaleRatio} alt="jump" style={style} />;
};
