type BrickProps = {
	id?: string;
	style?: React.CSSProperties;
};

export const Brick = ({ id, style }: BrickProps) => <div id={id} className="brick" style={style}></div>;
