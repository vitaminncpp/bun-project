import APIEndpoints from "../constants/apiEndpoints";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as shellController from "../controllers/shell.controller";
import * as validations from "../validations/common.validations";
import { Hono } from "hono";

const router = new Hono();

router.post(
  APIEndpoints.SHELL,
  authMiddleware.authenticate,
  validations.validateConnectionId,
  shellController.startShell,
);

export default router;
