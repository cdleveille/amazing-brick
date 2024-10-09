type BrickProps = {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
};

export const Brick = ({ id, className, style }: BrickProps) => {
	return <div id={id} className={`brick ${className}`} style={style}></div>;
};
