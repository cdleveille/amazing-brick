import React from "react";

import { useAppContext } from "@hooks";

type TextProps = {
	children: React.ReactNode;
	size: number;
	style?: React.CSSProperties;
};

export const Text = ({ children, size, style }: TextProps) => {
	const {
		canvas: { scaleRatio }
	} = useAppContext();
	return <span style={{ ...style, fontSize: `${size * scaleRatio}px` }}>{children}</span>;
};
