import { io } from "socket.io-client";

import { SocketEvent } from "@constants";
import { Config } from "@utils";

export const socket = io(`${location.protocol}//${location.hostname}:${Config.WS_PORT}`);

socket.on(SocketEvent.Reload, () => window.location.reload());
