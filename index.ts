import { Hono } from "hono";
import routes from "./src/routers/router";
import APIEndpoints from "./src/constants/apiEndpoints";
import { Server } from "socket.io";
import Constants from "./src/constants/constants";

const app = new Hono();
app.route(APIEndpoints.API!, routes);

const bunServer = Bun.serve({
  fetch: app.fetch,
  port: 4000,
  websocket: {
    open(ws) {
      console.log("Client connected");
      ws.send("Hello from server");
    },

    message(ws, message) {
      console.log("Received from client:", message);
      ws.send(`Echo: ${message}`);
    },

    close(ws) {
      console.log("Client disconnected");
    },
  },
});
