import { Server, Socket } from "socket.io";
import Constants from "../constants/constants";
import Logger from "../utils/logger";
import type { User } from "../models/User.model";

export function register(io: Server, socket: Socket): void {
  socket.on(Constants.REGISTER_EVENT, (user: User) => {
    Logger.info(`User registered: `, user.id);
    io.emit(Constants.REGISTER_EVENT, user);
  });

  socket.on(Constants.PRIVATE_CHAT, (data: { user: User; message: string }) => {
    io.emit(Constants.PRIVATE_CHAT, data);
  });
}
