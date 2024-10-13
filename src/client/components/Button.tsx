import { useEffect, useState } from "react";

import { Text } from "@components";
import { useAppContext, useStyles } from "@hooks";

import type { TScreen } from "@types";

type ButtonProps = {
	backgroundColor: string;
	screenTarget?: TScreen;
	onClick?: () => void;
	children?: React.ReactNode;
	autoFocus?: boolean;
	forceTouch?: boolean;
	disabled?: boolean;
};

export const Button = ({
	backgroundColor,
	screenTarget,
	onClick,
	children,
	autoFocus,
	forceTouch,
	disabled
}: ButtonProps) => {
	const [isClickable, setIsClickable] = useState(false);

	const { setScreen } = useAppContext();

	const { styles } = useStyles();

	useEffect(() => {
		const timeout = setTimeout(() => setIsClickable(true), 100);
		return () => clearTimeout(timeout);
	}, []);

	const handleClick = () => {
		if (!isClickable) return;
		if (screenTarget) setScreen(screenTarget);
		onClick?.();
	};

	const handleTouchEnd = () => {
		if (!forceTouch) return;
		handleClick();
	};

	return (
		<button
			className="btn"
			style={styles.button(backgroundColor)}
			onClick={handleClick}
			autoFocus={autoFocus}
			onTouchEnd={handleTouchEnd}
			disabled={disabled}
		>
			<Text size={26}>{children}</Text>
		</button>
	);
};
