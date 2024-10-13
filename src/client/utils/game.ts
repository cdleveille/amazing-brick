import { GameMode } from "@constants";

import type { TPoint, TRectangle, TDiamond, TGameMode } from "@types";

export const isRectangleIntersectingDiamond = (rect: TRectangle, diamond: TDiamond) => {
	const isPointInRectangle = (point: TPoint, rect: TRectangle) => {
		return (
			point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height
		);
	};

	const isPointInDiamond = (point: TPoint, diamond: TDiamond) => {
		const dx = Math.abs(point.x - diamond.cx);
		const dy = Math.abs(point.y - diamond.cy);
		return dx + dy <= diamond.size;
	};

	const getRectangleCorners = (rect: TRectangle) => {
		return [
			{ x: rect.x, y: rect.y }, // Top-left
			{ x: rect.x + rect.width, y: rect.y }, // Top-right
			{ x: rect.x, y: rect.y + rect.height }, // Bottom-left
			{ x: rect.x + rect.width, y: rect.y + rect.height } // Bottom-right
		] as TPoint[];
	};

	const getDiamondCorners = (diamond: TDiamond) => {
		return [
			{ x: diamond.cx, y: diamond.cy - diamond.size }, // Top
			{ x: diamond.cx + diamond.size, y: diamond.cy }, // Right
			{ x: diamond.cx, y: diamond.cy + diamond.size }, // Bottom
			{ x: diamond.cx - diamond.size, y: diamond.cy } // Left
		] as TPoint[];
	};

	// Check if any rectangle corner is inside the diamond
	const rectCorners = getRectangleCorners(rect);
	for (const corner of rectCorners) {
		if (isPointInDiamond(corner, diamond)) {
			return true;
		}
	}

	// Check if any diamond corner is inside the rectangle
	const diamondCorners = getDiamondCorners(diamond);
	for (const corner of diamondCorners) {
		if (isPointInRectangle(corner, rect)) {
			return true;
		}
	}

	// If no corners overlap, return false
	return false;
};

export const gameModes = [
	{
		name: GameMode.Standard,
		description: "How high can you climb?"
	},
	{
		name: GameMode.Sprint,
		description: "Don't let the timer run out!"
	},
	{
		name: GameMode.Shrouded,
		description: "Caution: reduced visibility!"
	},
	{
		name: GameMode.Gotcha,
		description: "Collect the golden bricks to score points!"
	}
] as TGameMode[];
