export const now = (): number => {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

export const loadImage = (url: string) => {
	const img = new Image();
	img.src = url;
	return img;
};
