/// <reference lib="dom" />

import { createRoot } from "react-dom/client";

import { Banner } from "@components";
import { useConfig, useSocket } from "@hooks";

const registerServiceWorker = async () => {
	if (!navigator.serviceWorker) return;
	if (!navigator.serviceWorker.controller) await navigator.serviceWorker.register("sw.js");
};

window.addEventListener("load", async () => {
	const {
		Config: { IS_PROD }
	} = useConfig();
	const { socket } = useSocket();
	socket.on("hello", () => console.log("socket.io: hello from server!"));
	socket.emit("hello");
	if (IS_PROD) await registerServiceWorker();
});

const rootDiv = document.createElement("div");
document.body.appendChild(rootDiv);
const root = createRoot(rootDiv);
root.render(<Banner width={200} height={200} />);
