import { Socket } from "socket.io";

interface SocketEntry {
  socket: Socket;
  authorized: boolean;
}

// connectionId => Active Socket
export const activeConnections: Map<string, SocketEntry> = new Map<string, SocketEntry>();
