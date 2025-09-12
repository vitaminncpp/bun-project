import { Hono } from "hono";
import APIEndpoints from "../constants/apiEndpoints";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as gameController from "../controllers/game.controller";
import * as commonValidations from "../validations/common.validations";

const router = new Hono();

router.post(
  APIEndpoints.MATCH_GUEST,
  commonValidations.validateConnectionId,
  gameController.startMatchGuest
);

router.delete(
  APIEndpoints.MATCH_ID,
  authMiddleware.authenticate,
  gameController.cancelMatchRequest
);

router.post(
  APIEndpoints.MATCH,
  authMiddleware.authenticate,
  commonValidations.validateConnectionId,
  gameController.startMatch
);

export default router;
