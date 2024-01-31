import { ReactNode } from "react";

interface IButtonProps {
	children: ReactNode;
	backgroundColor: string;
	onClick: () => void;
}

export const Button = ({ children, backgroundColor, onClick }: IButtonProps) => {
	return (
		<div className="button" style={{ backgroundColor }} onClick={onClick}>
			{children}
		</div>
	);
};
