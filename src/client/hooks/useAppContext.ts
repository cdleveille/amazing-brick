import { createContext, useContext } from "react";

import type { TAppContext } from "@types";

export const AppContext = createContext<TAppContext | null>(null);

export const useAppContext = () => {
	const ctx = useContext(AppContext);
	if (!ctx) throw new Error("useAppContext must be used within AppContext provider!");
	return ctx;
};
