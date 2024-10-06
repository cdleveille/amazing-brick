export const useIsOffline = () => {
	const isOffline = !navigator.onLine;
	return { isOffline };
};
