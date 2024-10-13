/// <reference lib="dom" />

import "./style.css";

import { createRoot } from "react-dom/client";

import { AppContextProvider } from "@components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Config, registerServiceWorker } from "@utils";

window.addEventListener("load", async () => {
	if (Config.IS_PROD) await registerServiceWorker();
});

const rootDiv = document.createElement("div");
document.body.appendChild(rootDiv);
const root = createRoot(rootDiv);
root.render(
	<QueryClientProvider client={new QueryClient()}>
		<AppContextProvider />
	</QueryClientProvider>
);
