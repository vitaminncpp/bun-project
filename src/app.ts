import express from "express";
import router from "./routers/router";
import APIEndpoints from "./constants/apiEndpoints";

const app = express();

app.use(express.json());
app.use(APIEndpoints.API, router);

export default app;