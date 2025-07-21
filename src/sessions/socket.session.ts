import { Socket } from "socket.io";

export const activeConnections: Map<string, Socket> = new Map<string, Socket>();
