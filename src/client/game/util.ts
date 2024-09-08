export const now = (): number => {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

export const assertGetElementById = (id: string): HTMLElement => {
	const ele = document.getElementById(id);
	if (!ele) throw new Error(`Element with id "${id}" not found`);
	return ele;
};
