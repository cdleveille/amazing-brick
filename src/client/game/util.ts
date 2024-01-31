export const now = (): number => {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};
