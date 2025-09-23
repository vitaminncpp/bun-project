import { serve } from '@hono/node-server'
import { createServer } from 'node:https'
import fs from 'node:fs'

import io from "./src/sockets";
import app from "./src/app";

import { getServerPort } from "./src/services/env.service";

const port = getServerPort();

const server = serve({
  fetch: app.fetch,
  createServer: createServer,
  serverOptions: {
    key: fs.readFileSync('D:/ssl certificates/server-ec.key'),
    cert: fs.readFileSync('D:/ssl certificates/server-ec.crt'),
  },
})

io.attach(server);

server.listen(port, () => {
  console.log("Server Started");
});
