import express from "express";

import {
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from "../controllers/authController/userProfileController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

import { validateBody } from "../middlewares/validate.js";

import { updateUserRoleSchema } from "../validators/userValidation.js";

const router = express.Router();

// ==========================================
// ADMIN USERS
// ==========================================

router.get("/users", isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router
  .route("/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    validateBody(updateUserRoleSchema),
    updateUserRole,
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;
