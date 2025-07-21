import { Server, Socket } from "socket.io";
import Constants from "../constants/constants";
import Logger from "../utils/logger";
import * as chatService from "../services/chat.service";
import { activeConnections } from "../sessions/socket.session";
import { pendingRequests } from "../sessions/game.session";
import { randomUUID } from "crypto";

const io = new Server({
  path: "/ws",
  cors: {
    origin: "*",
  },
});

io.on(Constants.CONNECTION, (socket: Socket) => {
  // TODO Auth logic Goes Here

  const connectionId: string = randomUUID();
  setTimeout(() => {
    socket.emit(Constants.SERVER_HELLO, { connectionId });
  }, 50);
  Logger.debug("User connected", connectionId);
  activeConnections.set(connectionId, socket);
  socket.on(Constants.DISCONNECT, () => {
    Logger.debug("User Disconnected");
    activeConnections.delete(connectionId);
    pendingRequests.delete(connectionId);
  });
  chatService.register(io, socket);
});

export default io;
