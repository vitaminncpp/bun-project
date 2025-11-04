import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";

import routes from "./routers/router";
import ApiConfig from "./config/api.config";
import { error404, errorHandler } from "./middlewares/error.middleware";

const app = new Hono();

app.use("*", cors());
app.route(ApiConfig.API, routes);
app.onError(errorHandler);
app.notFound(error404);

showRoutes(app);

export default app;
