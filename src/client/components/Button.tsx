import { useAppContext } from "@hooks";

type ButtonProps = {
	onClick: () => void;
	backgroundColor: string;
	className?: string;
	children?: React.ReactNode;
};

export const Button = ({ onClick, backgroundColor, className, children }: ButtonProps) => {
	const {
		canvas: { scaleRatio }
	} = useAppContext();

	return (
		<button
			className={`btn ${className}`}
			style={{
				backgroundColor: backgroundColor,
				width: `${164 * scaleRatio}px`,
				height: `${44 * scaleRatio}px`,
				borderRadius: `${32 * scaleRatio}px`
			}}
			onClick={onClick}
		>
			{children}
		</button>
	);
};
