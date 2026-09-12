


import express from "express";

// MIDDLEWARES
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";

// VALIDATORS
import { updateUserRoleSchema } from "../validators/userValidation.js";

// USER CONTROLLERS
import {
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from "../controllers/authController/userProfileController.js";

// SELLER CONTROLLERS
import {
  getPendingSellers,
  approveSeller,
  rejectSeller,
} from "../controllers/authController/adminController.js";

// PRODUCT & ORDER CONTROLLERS (READ-ONLY FOR ADMIN)
import { getAdminProducts } from "../controllers/productController/getAdminProductsController.js";
import { getAllOrders } from "../controllers/orderController/getAllOrdersController.js";
import { getAdminDashboardStats } from "../controllers/orderController/getAdminDashboardStats.js";

// OTHER CONTROLLERS
import { getSystemHealth } from "../controllers/healthController.js";

const router = express.Router();

// =====================================================
// ADMIN DASHBOARD & SYSTEM
// =====================================================
router.get(
  "/dashboard",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAdminDashboardStats
);

router.get(
  "/system-health",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getSystemHealth
);

// =====================================================
// ADMIN CATALOG & ORDERS (VIEW ALL)
// =====================================================
router.get(
  "/products",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAdminProducts
);

router.get(
  "/orders",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllOrders
);

// =====================================================
// ADMIN USERS MANAGEMENT
// =====================================================
router.get(
  "/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUsers
);

router
  .route("/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    validateBody(updateUserRoleSchema),
    updateUserRole
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

// =====================================================
// SELLER APPROVAL MANAGEMENT
// =====================================================
router.get(
  "/sellers/pending",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getPendingSellers
);

router.put(
  "/seller/approve/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  approveSeller
);

router.delete(
  "/seller/reject/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  rejectSeller
);

export default router;