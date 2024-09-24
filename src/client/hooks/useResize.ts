import { useEffect } from "react";

import { TCanvas } from "@types";

export const useResize = (setCanvas: React.Dispatch<React.SetStateAction<TCanvas | undefined>>) => {
	const onResize = () => {
		const aspectRatio = 1290 / 2294;
		const scaleCoefficient = 838.18;
		const heightUsingMaxWidth = Math.floor(window.innerWidth / aspectRatio);
		if (heightUsingMaxWidth <= window.innerHeight) {
			const canvasUsingMaxWidth = {
				width: Math.max(window.innerWidth, 3),
				height: Math.max(heightUsingMaxWidth, 4),
				xOffset: 0,
				yOffset: (window.innerHeight - heightUsingMaxWidth) / 2,
				scaleRatio: heightUsingMaxWidth / scaleCoefficient
			};
			setCanvas(canvasUsingMaxWidth);
			return canvasUsingMaxWidth;
		}
		const widthUsingMaxHeight = Math.floor(window.innerHeight * aspectRatio);
		const canvasUsingMaxHeight = {
			width: Math.max(widthUsingMaxHeight, 3),
			height: Math.max(window.innerHeight, 4),
			xOffset: (window.innerWidth - widthUsingMaxHeight) / 2,
			yOffset: 0,
			scaleRatio: window.innerHeight / scaleCoefficient
		};
		setCanvas(canvasUsingMaxHeight);
		return canvasUsingMaxHeight;
	};

	useEffect(() => {
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);
};
