import { GameMode } from "@constants";

import type { TPoint, TRectangle, TDiamond, TGameMode } from "@types";

// Optimized function to check if a rectangle is colliding with a diamond
export const isRectangleIntersectingDiamond = (rect: TRectangle, diamond: TDiamond) => {
	// Function to check if two axis-aligned bounding boxes (AABBs) intersect
	const doAABBsIntersect = (rect1: TRectangle, rect2: TRectangle) => {
		return (
			rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y
		);
	};

	// Function to check if a point is inside the rectangle
	const isPointInRectangle = (point: TPoint, rect: TRectangle) => {
		return (
			point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height
		);
	};

	// Function to check if a point is inside the diamond
	const isPointInDiamond = (point: TPoint, diamond: TDiamond) => {
		const dx = Math.abs(point.x - diamond.cx);
		const dy = Math.abs(point.y - diamond.cy);
		return dx + dy <= diamond.radius;
	};

	// Optimized function to check if two lines intersect (line segment intersection)
	const doLinesIntersect = (p1: TPoint, p2: TPoint, p3: TPoint, p4: TPoint) => {
		const det = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
		if (det === 0) return false; // Parallel lines

		const lambda = ((p4.y - p3.y) * (p4.x - p1.x) + (p3.x - p4.x) * (p4.y - p1.y)) / det;
		const gamma = ((p1.y - p2.y) * (p4.x - p1.x) + (p2.x - p1.x) * (p4.y - p1.y)) / det;

		return 0 <= lambda && lambda <= 1 && 0 <= gamma && gamma <= 1;
	};

	// Step 1: Get the axis-aligned bounding box (AABB) of the diamond
	const diamondAABB: TRectangle = {
		x: diamond.cx - diamond.radius,
		y: diamond.cy - diamond.radius,
		width: diamond.radius * 2,
		height: diamond.radius * 2
	};

	// Step 2: Quick AABB collision check (early exit)
	if (!doAABBsIntersect(rect, diamondAABB)) {
		return false; // No intersection at all
	}

	// Step 3: Get the four corners of the rectangle
	const rectCorners: TPoint[] = [
		{ x: rect.x, y: rect.y }, // Top-left
		{ x: rect.x + rect.width, y: rect.y }, // Top-right
		{ x: rect.x, y: rect.y + rect.height }, // Bottom-left
		{ x: rect.x + rect.width, y: rect.y + rect.height } // Bottom-right
	];

	// Step 4: Get the four corners of the diamond
	const diamondCorners: TPoint[] = [
		{ x: diamond.cx, y: diamond.cy - diamond.radius }, // Top
		{ x: diamond.cx + diamond.radius, y: diamond.cy }, // Right
		{ x: diamond.cx, y: diamond.cy + diamond.radius }, // Bottom
		{ x: diamond.cx - diamond.radius, y: diamond.cy } // Left
	];

	// Step 5: Check if any rectangle corner is inside the diamond (early exit)
	for (const corner of rectCorners) {
		if (isPointInDiamond(corner, diamond)) {
			return true;
		}
	}

	// Step 6: Check if any diamond corner is inside the rectangle (early exit)
	for (const corner of diamondCorners) {
		if (isPointInRectangle(corner, rect)) {
			return true;
		}
	}

	// Step 7: Check for edge intersection
	const rectEdges = [
		[rectCorners[0], rectCorners[1]], // Top edge
		[rectCorners[1], rectCorners[3]], // Right edge
		[rectCorners[3], rectCorners[2]], // Bottom edge
		[rectCorners[2], rectCorners[0]] // Left edge
	];

	const diamondEdges = [
		[diamondCorners[0], diamondCorners[1]], // Top-right edge
		[diamondCorners[1], diamondCorners[2]], // Right-bottom edge
		[diamondCorners[2], diamondCorners[3]], // Bottom-left edge
		[diamondCorners[3], diamondCorners[0]] // Left-top edge
	];

	// Step 8: Check for edge intersection (after all other checks failed)
	for (const rectEdge of rectEdges) {
		for (const diamondEdge of diamondEdges) {
			if (doLinesIntersect(rectEdge[0], rectEdge[1], diamondEdge[0], diamondEdge[1])) {
				return true;
			}
		}
	}

	// Step 9: No collision found
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
