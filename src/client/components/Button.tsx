import { ReactNode } from "react";

interface IButtonProps {
	children: ReactNode;
	backgroundColor: string;
	onClick: () => void;
	scaleRatio: number;
	margin?: number;
}

export const Button = ({ children, backgroundColor, onClick, scaleRatio, margin = 0 }: IButtonProps) => {
	return (
		<div
			className="button"
			style={{
				backgroundColor,
				width: `${180 * scaleRatio}px`,
				height: `${54 * scaleRatio}px`,
				padding: `${12 * scaleRatio}px`,
				fontSize: `${22 * scaleRatio}px`,
				margin: `${margin * scaleRatio}px`
			}}
			onClick={onClick}
		>
			{children}
		</div>
	);
};
