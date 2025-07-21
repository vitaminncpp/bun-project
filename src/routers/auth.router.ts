import { Router } from "express";
import APIEndpoints from "../constants/apiEndpoints";
import * as authController from "../controllers/auth.controller";
import * as authValidations from "../validations/auth.validation";

const router = Router();

router.post(APIEndpoints.REGISTER, authValidations.validateRegistration, authController.register);
router.post(APIEndpoints.LOGIN, authValidations.validateLogin, authController.login);
router.post(APIEndpoints.REFRESH, authValidations.validateRefresh, authController.refreshToken);

export default router;
