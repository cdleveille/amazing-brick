import { useAppContext } from "@hooks";

type ButtonProps = {
	onClick: () => void;
	backgroundColor: string;
	className?: string;
	children?: React.ReactNode;
	autoFocus?: boolean;
};

export const Button = ({ onClick, backgroundColor, className, children, autoFocus }: ButtonProps) => {
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
			autoFocus={autoFocus}
		>
			{children}
		</button>
	);
};
