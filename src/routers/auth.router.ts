import { Hono } from "hono";
import ApiConfig from "../config/api.config";
import * as authController from "../auth/auth.controller";
import * as authValidations from "../validations/auth.validation";

const router = new Hono();

router.post(ApiConfig.REGISTER, authValidations.validateRegistration, authController.register);
router.post(ApiConfig.LOGIN, authValidations.validateLogin, authController.login);

router.post(ApiConfig.REFRESH, authValidations.validateRefresh, authController.refreshToken);

export default router;
