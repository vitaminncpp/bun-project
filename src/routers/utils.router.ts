import { Hono } from "hono";
import APIEndpoints from "../constants/apiEndpoints";
import * as utilsController from "../controllers/utils.controller";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as commonValidations from "../validations/common.validations";

const router = new Hono();

router.post(
  APIEndpoints.FILE,
  authMiddleware.authenticate,
  commonValidations.validateUploadFile,
  utilsController.uploadFile
);

export default router;
