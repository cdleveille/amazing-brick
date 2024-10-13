import { GameMode } from "@constants";

import type { TPoint, TRectangle, TDiamond, TGameMode } from "@types";

export const isRectangleIntersectingDiamond = (rect: TRectangle, diamond: TDiamond) => {
	const isPointInRectangle = (point: TPoint, rect: TRectangle) => {
		return (
			point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height
		);
	};

	const isPointInDiamond = (point: TPoint, diamond: TDiamond) => {
		// The diamond is a rotated square, so we need to use a special check
		const dx = Math.abs(point.x - diamond.cx);
		const dy = Math.abs(point.y - diamond.cy);
		// Check if the point lies within the rotated diamond bounds
		return dx + dy <= diamond.radius;
	};

	// Step 1: Get the four corners of the rectangle
	const rectCorners: TPoint[] = [
		{ x: rect.x, y: rect.y }, // Top-left
		{ x: rect.x + rect.width, y: rect.y }, // Top-right
		{ x: rect.x, y: rect.y + rect.height }, // Bottom-left
		{ x: rect.x + rect.width, y: rect.y + rect.height } // Bottom-right
	];

	// Step 2: Get the four corners of the diamond
	const diamondCorners: TPoint[] = [
		{ x: diamond.cx, y: diamond.cy - diamond.radius }, // Top
		{ x: diamond.cx + diamond.radius, y: diamond.cy }, // Right
		{ x: diamond.cx, y: diamond.cy + diamond.radius }, // Bottom
		{ x: diamond.cx - diamond.radius, y: diamond.cy } // Left
	];

	// Step 3: Check if any rectangle corner is inside the diamond
	for (const corner of rectCorners) {
		if (isPointInDiamond(corner, diamond)) {
			return true;
		}
	}

	// Step 4: Check if any diamond corner is inside the rectangle
	for (const corner of diamondCorners) {
		if (isPointInRectangle(corner, rect)) {
			return true;
		}
	}

	// Step 5: No collision found
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
