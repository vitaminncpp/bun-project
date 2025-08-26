import { Hono } from "hono";
import APIEndpoints from "../constants/apiEndpoints";
import * as utilsController from "../controllers/utils.controller";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as commonvalidations from "../validations/common.validations";

const router = new Hono();

router.post(
  APIEndpoints.FILE,
  authMiddleware.authenticate,
  commonvalidations.validateUploadfile,
  utilsController.uploadFile
);

export default router;
