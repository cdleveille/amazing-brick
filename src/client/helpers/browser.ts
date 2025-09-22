import { Config } from "@/client/helpers/config";

export const assertGetElementById = (id: string) => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Element with id '${id}' not found`);
  return element;
};

export const registerServiceWorker = async () => {
  if (!Config.IS_PROD || !navigator.serviceWorker) return;

  const registration = await navigator.serviceWorker.register("sw.js", {
    type: "module",
    scope: "/",
  });

  if (registration.active) await registration.update();
};

export const now = () => window.performance?.now?.() ?? Date.now();

const accessStorage = (storage: Storage) => ({
  setItem: (key: string, data: unknown) => storage.setItem(key, JSON.stringify(data)),
  getItem: <T = unknown>(key: string) => {
    const data = storage.getItem(key);
    if (data !== null) return JSON.parse(data) as T;
    return null;
  },
  removeItem: (key: string) => storage.removeItem(key),
});

export const storage = {
  local: accessStorage(window.localStorage),
  session: accessStorage(window.sessionStorage),
};

export const executeOnClass = (className: string, callback: (ele: Element) => void) => {
  const elements = document.getElementsByClassName(className);
  for (let i = 0; i < elements.length; i++) {
    callback(elements[i]);
  }
};

export const doesSystemPreferDarkTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
