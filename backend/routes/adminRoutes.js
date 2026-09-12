


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

import {
  deleteOrder,
  getDeletedOrders,
  restoreOrder,
  permanentDeleteOrder,
  emptyTrash,
} from "../controllers/orderController/deleteOrderController.js";

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
// ADMIN ORDER MANAGEMENT
// =====================================================

// Get all orders
// GET /api/v1/admin/orders
router.get(
  "/orders",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllOrders
);


// =====================================================
// ADMIN TRASH
// =====================================================

// Get deleted orders
// GET /api/v1/admin/orders/deleted
router.get(
  "/orders/deleted",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getDeletedOrders
);


// Empty trash
// DELETE /api/v1/admin/orders/trash/empty
router.delete(
  "/orders/trash/empty",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  emptyTrash
);


// =====================================================
// ADMIN SINGLE ORDER ACTIONS
// =====================================================

// Soft delete order
// DELETE /api/v1/admin/order/:id
router.delete(
  "/order/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteOrder
);


// Restore order
// PUT /api/v1/admin/order/restore/:id
router.put(
  "/order/restore/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  restoreOrder
);


// Permanently delete order
// DELETE /api/v1/admin/order/permanent/:id
router.delete(
  "/order/permanent/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  permanentDeleteOrder
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