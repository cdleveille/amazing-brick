import { useAppContext } from "@hooks";

type TextProps = {
	text: string;
	size: number;
	style?: React.CSSProperties;
};

export const Text = ({ text, size, style }: TextProps) => {
	const {
		canvas: { scaleRatio }
	} = useAppContext();
	return <span style={{ ...style, fontSize: `${size * scaleRatio}px` }}>{text}</span>;
};
