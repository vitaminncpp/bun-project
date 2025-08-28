import { Socket } from "socket.io";

// connectionId => Active Socket
export const activeConnections: Map<string, Socket> = new Map<string, Socket>();
