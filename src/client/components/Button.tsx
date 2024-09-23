import { useEffect, useState } from "react";

import { useAppContext } from "@hooks";

type ButtonProps = {
	onClick: () => void;
	backgroundColor: string;
	className?: string;
	children?: React.ReactNode;
	autoFocus?: boolean;
	forceTouch?: boolean;
};

export const Button = ({ onClick, backgroundColor, className, children, autoFocus, forceTouch }: ButtonProps) => {
	const [isClickable, setIsClickable] = useState(false);

	const {
		canvas: { scaleRatio }
	} = useAppContext();

	useEffect(() => {
		const timeout = setTimeout(() => setIsClickable(true), 100);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<button
			className={`btn ${className}`}
			style={{
				backgroundColor: backgroundColor,
				width: `${192 * scaleRatio}px`,
				height: `${56 * scaleRatio}px`,
				borderRadius: `${32 * scaleRatio}px`
			}}
			onClick={() => isClickable && onClick()}
			autoFocus={autoFocus}
			onTouchEnd={() => {
				if (!forceTouch || !isClickable) return;
				onClick();
			}}
		>
			{children}
		</button>
	);
};
