import { CSSProperties, useMemo } from "react";

import { Color, GameMode } from "@constants";
import { useAppContext } from "@hooks";

export const useStyles = () => {
	const { canvas, screen, isDarkMode, gameMode, isGameMode, isPaused } = useAppContext();
	const { scaleRatio } = canvas;

	const styles = useMemo(() => {
		return {
			canvas: {
				top: canvas.yOffset,
				left: canvas.xOffset,
				width: canvas.width,
				height: canvas.height,
				backgroundColor: isDarkMode ? Color.DarkBlue : Color.White,
				color: isDarkMode ? Color.White : Color.Black
			} as CSSProperties,
			coverTop: {
				top: 0,
				left: 0,
				height: canvas.yOffset
			} as CSSProperties,
			coverBottom: {
				top: canvas.yOffset + canvas.height,
				left: 0,
				height: canvas.yOffset
			} as CSSProperties,
			homeContainer: {
				paddingTop: `${128 * scaleRatio}px`,
				rowGap: `${72 * scaleRatio}px`
			} as CSSProperties,
			homeHeader: {
				fontSize: `${72 * scaleRatio}px`,
				lineHeight: `${64 * scaleRatio}px`
			} as CSSProperties,
			homeBrick: {
				position: "absolute",
				width: `${36 * scaleRatio}px`,
				height: `${36 * scaleRatio}px`,
				top: `${76 * scaleRatio}px`,
				left: `${33 * scaleRatio}px`,
				backgroundColor: isDarkMode ? Color.White : Color.Black
			} as CSSProperties,
			homeGameModeSelect: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				rowGap: `${16 * scaleRatio}px`
			} as CSSProperties,
			homeGameModeDescription: {
				color: isDarkMode ? "#cccccc" : "#555555"
			} as CSSProperties,
			homeButtonStack: {
				display: "flex",
				flexDirection: "column",
				rowGap: `${32 * scaleRatio}px`
			} as CSSProperties,
			pauseOverlay: {
				width: canvas.width,
				height: canvas.height,
				rowGap: `${32 * scaleRatio}px`
			} as CSSProperties,
			pauseBtnOuter: {
				width: `${44 * scaleRatio}px`,
				height: `${44 * scaleRatio}px`,
				border: `${1 * scaleRatio}px solid ${isDarkMode || isGameMode(GameMode.Shrouded) ? Color.White : Color.Black}`,
				margin: `${14 * scaleRatio}px`,
				boxShadow: `0 0 ${2 * scaleRatio}px ${isDarkMode || isGameMode(GameMode.Shrouded) ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}`
			} as CSSProperties,
			pauseBtnInner: {
				width: `${12 * scaleRatio}px`,
				height: `${18 * scaleRatio}px`,
				borderLeft: `${1 * scaleRatio}px solid ${isDarkMode || isGameMode(GameMode.Shrouded) ? Color.White : Color.Black}`,
				borderRight: `${1 * scaleRatio}px solid ${isDarkMode || isGameMode(GameMode.Shrouded) ? Color.White : Color.Black}`
			} as CSSProperties,
			jumpContainer: {
				display: "flex",
				justifyContent: "center",
				columnGap: `${90 * scaleRatio}px`
			} as CSSProperties,
			jumpArrowLeft: {
				rotate: "180deg",
				color: "#ff0000",
				visibility: isPaused ? "hidden" : "visible",
				fontSize: `${40 * scaleRatio}px`
			} as CSSProperties,
			jumpArrowRight: {
				color: "#ff0000",
				visibility: isPaused ? "hidden" : "visible",
				fontSize: `${40 * scaleRatio}px`
			} as CSSProperties,
			jumpSvg: {
				marginTop: `${-90 * scaleRatio}px`,
				width: `${250 * scaleRatio}px`
			} as CSSProperties,
			rateContainer: {
				rowGap: `${64 * scaleRatio}px`
			} as CSSProperties,
			rateThumbButtons: {
				display: "flex",
				flexDirection: "row",
				columnGap: `${40 * scaleRatio}px`
			} as CSSProperties,
			rateTextArea: {
				width: "95%",
				height: "20%",
				fontSize: `${18 * scaleRatio}px`,
				padding: `${8 * scaleRatio}px`,
				backgroundColor: isDarkMode ? Color.DarkBlue : Color.White,
				color: isDarkMode ? Color.White : Color.Black,
				transition: "0.2s ease-in-out"
			} as CSSProperties,
			rateButtonStack: {
				display: "flex",
				flexDirection: "column",
				rowGap: `${32 * scaleRatio}px`
			} as CSSProperties,
			rateThumbButton: (isSelected: boolean) =>
				({
					fontSize: `${80 * scaleRatio}px`,
					outline: `${3 * scaleRatio}px solid ${isSelected ? Color.Gray : "transparent"}`,
					backgroundColor: "transparent",
					cursor: isSelected ? "default" : "pointer",
					transform: isSelected ? "scale(1.2)" : "scale(1)",
					padding: `${16 * scaleRatio}px`
				}) as CSSProperties,
			rateThumbSvg: {
				width: `${120 * scaleRatio}px`,
				height: `${120 * scaleRatio}px`
			} as CSSProperties,
			offline: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				fontFamily: "Roboto-Regular",
				rowGap: `${16 * scaleRatio}px`
			} as CSSProperties,
			thanksContainer: {
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100%",
				rowGap: `${32 * scaleRatio}px`
			} as CSSProperties,
			thanksText: {
				fontSize: `${24 * scaleRatio}px`,
				textAlign: "center",
				fontFamily: "Roboto-Thin",
				fontWeight: "bolder"
			} as CSSProperties,
			button: (backgroundColor: string) =>
				({
					backgroundColor,
					width: `${224 * scaleRatio}px`,
					height: `${56 * scaleRatio}px`,
					borderRadius: `${32 * scaleRatio}px`
				}) as CSSProperties,
			text: (size: number) => ({ fontSize: `${size * scaleRatio}px` }) as CSSProperties,
			timerContainer: {
				fontSize: `${40 * scaleRatio}px`,
				fontFamily: "Roboto-Thin",
				fontWeight: "bold",
				margin: `${8 * scaleRatio}px ${16 * scaleRatio}px`,
				marginLeft: `${-4 * scaleRatio}px`,
				color: isDarkMode ? "#cccccc" : "#888888"
			} as CSSProperties,
			timerIcon: {
				color: isDarkMode ? "#cccccc" : "#888888",
				fontSize: `${28 * scaleRatio}px`,
				marginRight: `${8 * scaleRatio}px`
			} as CSSProperties,
			score: {
				fontSize: `${40 * scaleRatio}px`,
				margin: `${8 * scaleRatio}px ${16 * scaleRatio}px`,
				color: isDarkMode || isGameMode(GameMode.Shrouded) ? Color.White : Color.Black
			} as CSSProperties,
			darkModeBtn: {
				top: 0,
				right: 0,
				padding: `${8 * scaleRatio}px`
			} as CSSProperties,
			darkModeBtnIcon: (color: string) => ({ color, fontSize: `${40 * scaleRatio}px` }) as CSSProperties,
			gameObjectContainer: {
				width: "100%",
				height: "100%",
				backgroundColor: isDarkMode ? Color.DarkBlue : Color.White
			} as CSSProperties,
			brick: {
				backgroundColor: isDarkMode ? Color.White : Color.Black
			} as CSSProperties,
			scoresContainer: {
				rowGap: `${28 * scaleRatio}px`,
				marginTop: `${28 * scaleRatio}px`
			} as CSSProperties,
			scoresBox: {
				border: `${1 * scaleRatio}px solid ${isDarkMode ? Color.White : Color.Black}`,
				borderRadius: `${32 * scaleRatio}px`,
				padding: `${48 * scaleRatio}px`,
				columnGap: `${54 * scaleRatio}px`,
				boxShadow: `0 0 ${2 * scaleRatio}px ${isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}`,
				width: "85%"
			} as CSSProperties,
			scoresBoxLabel: {
				fontSize: `${24 * scaleRatio}px`,
				textAlign: "center"
			} as CSSProperties,
			scoresBoxValue: {
				fontSize: `${48 * scaleRatio}px`
			} as CSSProperties,
			scoresTopTenContainer: {
				marginTop: `${16 * scaleRatio}px`
			} as CSSProperties,
			scoresTopTenItem: (index: number) =>
				({
					backgroundColor: index % 2 === 0 ? (isDarkMode ? Color.DarkGray : Color.LightGray) : "transparent",
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					columnGap: `${16 * scaleRatio}px`,
					width: "100%",
					transition: "0.2s ease-in-out"
				}) as CSSProperties,
			shroud: {
				background: `radial-gradient(circle, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 65%)`,
				width: "102%",
				height: "102%",
				zIndex: 500
			} as CSSProperties,
			loadingContainer: {
				marginTop: `${28 * scaleRatio}px`,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				height: "50%"
			} as CSSProperties,
			loadingIndicator: {
				color: isDarkMode ? Color.White : Color.Black,
				size: `${100 * scaleRatio}px`
			} as CSSProperties & { size: string }
		};
	}, [canvas, screen, isDarkMode, gameMode, scaleRatio, isPaused]);

	return { styles };
};
