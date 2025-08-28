import APIEndpoints from "../constants/apiEndpoints";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as shellController from "../controllers/shell.controller";
import { Hono } from "hono";

const router = new Hono();

router.post(
  APIEndpoints.SHELL,
  authMiddleware.authenticate,
  shellController.startShell
);

export default router;
