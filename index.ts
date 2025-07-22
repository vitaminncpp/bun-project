import { Hono } from "hono";
import routes from "./src/routers/router";
import APIEndpoints from "./src/constants/apiEndpoints";
import { Server, Socket } from "socket.io";
import { createAdaptorServer } from "@hono/node-server";
import Constants from "./src/constants/constants";
import { showRoutes } from "hono/dev";
import { errorHandler } from "./src/middlewares/error.middleware";

const app = new Hono();
app.route(APIEndpoints.API!, routes);
app.onError(errorHandler);
const httpServer = createAdaptorServer(app);
let i = 0;

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
console.log(process.env);

io.on(Constants.CONNECTION, (socket: Socket) => {
  setInterval(() => {
    socket.emit("hello", "Hello from socket " + i++);
  }, 300);
  console.log("socket.io");
});

httpServer.listen(4000, () => {
  console.log("Server Started");
});

showRoutes(app);
