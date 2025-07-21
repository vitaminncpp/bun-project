import { Hono } from "hono";
import routes from "./src/routers/router";
import APIEndpoints from "./src/constants/apiEndpoints";
import { Server } from "socket.io";
import { createServer } from "http2";
import { serve, createAdaptorServer } from "@hono/node-server";
import Constants from "./src/constants/constants";

const app = new Hono();
app.route(APIEndpoints.API!, routes);

const httpServer = createAdaptorServer(app);

// const bunServer = Bun.serve({
//   fetch: app.fetch,
//   port: 4000,
// });

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on(Constants.CONNECTION, () => {
  console.log("socket.io");
});

httpServer.listen(4000, () => {
  console.log("Server Started");
});
