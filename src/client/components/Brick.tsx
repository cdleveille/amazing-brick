import { useAppContext } from "@hooks";

type BrickProps = {
	id?: string;
	style?: React.CSSProperties;
};

export const Brick = ({ id, style }: BrickProps) => {
	const { isDarkMode } = useAppContext();
	return (
		<div id={id} className="brick" style={{ ...style, backgroundColor: isDarkMode ? "#ffffff" : "#000000" }}></div>
	);
};
