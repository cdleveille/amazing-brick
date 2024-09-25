import { useState } from "react";

import { Button, Text } from "@components";
import { Color } from "@constants";
import { useApi, useAppContext } from "@hooks";
import { Textarea } from "@mui/joy";

export const Rate = () => {
	const [isThumbsUp, setIsThumbsUp] = useState<boolean>();
	const [comments, setComments] = useState<string>("");

	const { submitRating } = useApi();

	const {
		canvas: { scaleRatio },
		setScreen,
		player_id
	} = useAppContext();

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
					padding: `${8 * scaleRatio}px`
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
					disabled={typeof isThumbsUp !== "boolean" || comments.trim() === ""}
					onClick={() => {
						if (typeof isThumbsUp !== "boolean" || comments.trim() === "") return;
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
				width: `${120 * scaleRatio}px`,
				height: `${120 * scaleRatio}px`,
				fontSize: `${80 * scaleRatio}px`,
				outline: `${3 * scaleRatio}px solid ${isSelected ? "#555555" : "#aaaaaa"}`,
				backgroundColor: isSelected ? "#eeeeee" : "#ffffff",
				cursor: isSelected ? "default" : "pointer",
				transform: isSelected ? "scale(1.05)" : "scale(1)"
			}}
			disabled={isSelected}
		>
			<div>{type === "thumbs-up" ? "👍" : "👎"}</div>
		</button>
	);
};
