import React from "react";

interface IButtonProps {
	label: React.ReactNode;
	backgroundColor: string;
	onClick: () => void;
}

export const Button = ({ label, backgroundColor, onClick }: IButtonProps) => {
	return (
		<div className="button" style={{ backgroundColor }} onClick={onClick}>
			{label}
		</div>
	);
};
