import { Router } from "express";
import APIEndpoints from "../constants/apiEndpoints";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as roleController from "../controllers/role.controller";
import * as roleValidatiosn from "../validations/role.validation";

const router = Router();

router.get(APIEndpoints.ROLE, authMiddleware.authenticate, roleController.getAllRoles);
router.post(
  APIEndpoints.ROLE,
  authMiddleware.authenticate,
  roleValidatiosn.validateCreateRole,
  roleController.createRole
);
router.get(APIEndpoints.ROLE_ID, authMiddleware.authenticate, roleController.getRole);
router.put(APIEndpoints.ROLE_ID, authMiddleware.authenticate, roleController.updateRole);
router.delete(APIEndpoints.ROLE_ID, authMiddleware.authenticate, roleController.deleteRole);

export default router;
