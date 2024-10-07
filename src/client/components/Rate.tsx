import { useState } from "react";

import { Button, Text } from "@components";
import { Color } from "@constants";
import { useApi, useAppContext, useIsOffline } from "@hooks";
import { Textarea } from "@mui/joy";

export const Rate = () => {
	const [isThumbsUp, setIsThumbsUp] = useState<boolean>();
	const [comments, setComments] = useState<string>("");

	const { submitRating } = useApi();

	const { isOffline } = useIsOffline();

	const {
		canvas: { scaleRatio },
		setScreen,
		player_id,
		isDarkMode
	} = useAppContext();

	const isSubmitDisabled = typeof isThumbsUp !== "boolean" || comments.trim() === "";

	if (isOffline)
		return (
			<div
				className="scores-container"
				style={{ rowGap: `${36 * scaleRatio}px`, marginTop: `${36 * scaleRatio}px` }}
			>
				<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue} autoFocus>
					<Text size={26}>HOME</Text>
				</Button>
				<div
					className="blink"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						fontFamily: "Roboto-Regular",
						rowGap: `${16 * scaleRatio}px`
					}}
				>
					<Text size={28}>OFFLINE</Text>
					<Text size={20}>Internet connection required to submit rating</Text>
				</div>
			</div>
		);

	return (
		<div className="rate-container" style={{ rowGap: `${64 * scaleRatio}px` }}>
			<div style={{ display: "flex", flexDirection: "row", columnGap: `${40 * scaleRatio}px` }}>
				<RateButton type="thumbs-up" onClick={() => setIsThumbsUp(true)} isSelected={isThumbsUp === true} />
				<RateButton type="thumbs-down" onClick={() => setIsThumbsUp(false)} isSelected={isThumbsUp === false} />
			</div>
			<Textarea
				className="text-area"
				value={comments}
				sx={{
					width: "95%",
					height: "20%",
					pointerEvents: "auto !important",
					userSelect: "auto !important",
					fontSize: `${18 * scaleRatio}px`,
					padding: `${8 * scaleRatio}px`,
					backgroundColor: isDarkMode ? Color.DarkBlue : Color.White,
					color: isDarkMode ? Color.White : Color.Black,
					transition: "0.2s ease-in-out"
				}}
				onChange={e => setComments(e.target.value)}
				placeholder={
					isThumbsUp === true
						? "What do you like about Amazing Brick?"
						: isThumbsUp === false
							? "What could be improved in Amazing Brick?"
							: "What do you think of Amazing Brick?"
				}
				spellCheck={false}
				autoComplete="off"
			/>
			<div style={{ display: "flex", flexDirection: "column", rowGap: `${32 * scaleRatio}px` }}>
				<Button
					disabled={isSubmitDisabled}
					onClick={() => {
						if (isSubmitDisabled) return;
						submitRating({ player_id, is_thumbs_up: isThumbsUp, comments: comments.trim() });
						setScreen("thanks");
					}}
					backgroundColor={Color.Green}
				>
					<Text size={26}>SUBMIT</Text>
				</Button>
				<Button onClick={() => setScreen("home")} backgroundColor={Color.Blue}>
					<Text size={26}>BACK</Text>
				</Button>
			</div>
		</div>
	);
};

type RateButtonProps = {
	type: "thumbs-up" | "thumbs-down";
	onClick: () => void;
	isSelected: boolean;
};

const RateButton = ({ type, onClick, isSelected }: RateButtonProps) => {
	const {
		canvas: { scaleRatio }
	} = useAppContext();

	return (
		<button
			className="btn-rate"
			onClick={onClick}
			style={{
				fontSize: `${80 * scaleRatio}px`,
				outline: `${3 * scaleRatio}px solid ${isSelected ? Color.Gray : "transparent"}`,
				backgroundColor: "transparent",
				cursor: isSelected ? "default" : "pointer",
				transform: isSelected ? "scale(1.2)" : "scale(1)",
				padding: `${16 * scaleRatio}px`
			}}
			disabled={isSelected}
		>
			<img
				src={`./assets/${type === "thumbs-up" ? "thumbs_up" : "thumbs_down"}.svg`}
				width={120 * scaleRatio}
				height={120 * scaleRatio}
				alt={type}
				style={{}}
			/>
		</button>
	);
};
