import { Server, Socket } from "socket.io";

interface SocketEntry {
  socket: Socket;
  authorized: boolean;
}

export let io: Server;

// connectionId => Active Socket as SocketEntry
export const activeConnections: Map<string, SocketEntry> = new Map<string, SocketEntry>();

export function setIO(_io: Server) {
  io = _io;
}
