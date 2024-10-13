export const now = () => {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

export const assertGetElementById = (id: string) => {
	const ele = document.getElementById(id);
	if (!ele) throw new Error(`Element with id "${id}" not found`);
	return ele;
};

export const executeOnClass = (className: string, callback: (ele: Element) => void) => {
	const elements = document.getElementsByClassName(className);
	for (let i = 0; i < elements.length; i++) {
		callback(elements[i]);
	}
};

export const setLocalStorageItem = (key: string, data: unknown) => {
	window.localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorageItem = <T = unknown>(key: string) => {
	const data = window.localStorage.getItem(key);
	if (data) return JSON.parse(data) as T;
	return null;
};

export const removeLocalStorageItem = (key: string) => {
	window.localStorage.removeItem(key);
};
