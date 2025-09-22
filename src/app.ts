import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";

import routes from "./routers/router";
import APIEndpoints from "./constants/apiEndpoints";
import { error404, errorHandler } from "./middlewares/error.middleware";

const app = new Hono();

app.use("*", cors());
app.route(APIEndpoints.API, routes);
app.onError(errorHandler);
app.notFound(error404);

showRoutes(app);

export default app;
