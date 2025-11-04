import { Hono } from "hono";
import ApiConfig from "../config/api.config";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as gameController from "../controllers/game.controller";
import * as commonValidations from "../validations/common.validations";

const router = new Hono();

router.post(
  ApiConfig.MATCH_GUEST,
  commonValidations.validateConnectionId,
  gameController.startMatchGuest,
);

router.delete(ApiConfig.MATCH_ID, authMiddleware.authenticate, gameController.cancelMatchRequest);

router.post(
  ApiConfig.MATCH,
  authMiddleware.authenticate,
  commonValidations.validateConnectionId,
  gameController.startMatch,
);

export default router;
