import express from "express";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { createOrderSchema } from "../validators/orderValidator.js";

import { createOrder } from "../controllers/orderController/createOrderController.js";
import { getSingleOrder } from "../controllers/orderController/getSingleOrderController.js";
import { myOrders } from "../controllers/orderController/getMyOrdersController.js";
import { getAllOrders } from "../controllers/orderController/getAllOrdersController.js";
import { updateOrderStatus } from "../controllers/orderController/updateOrderStatusController.js";
import { cancelOrder } from "../controllers/orderController/cancelOrderController.js";
import {
  deleteOrder,
  deleteMyOrder,
  getDeletedOrders,
  restoreOrder,
  permanentDeleteOrder,
  emptyTrash,
} from "../controllers/orderController/deleteOrderController.js";

const router = express.Router();

// ==========================================
// USER ROUTES
// ==========================================
router
  .route("/order/new")
  .post(isAuthenticatedUser, validateBody(createOrderSchema), createOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/order/cancel/:id").put(isAuthenticatedUser, cancelOrder);
router.route("/order/my/:id").delete(isAuthenticatedUser, deleteMyOrder);

// ==========================================
// ADMIN ROUTES
// ==========================================
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

// Trash list (soft-deleted orders)
router
  .route("/admin/orders/deleted")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getDeletedOrders);

// Empty entire trash — MUST come before "/admin/order/:id" style routes to avoid conflicts
router
  .route("/admin/orders/trash/empty")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), emptyTrash);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder); // soft delete

router
  .route("/admin/order/restore/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), restoreOrder);

router
  .route("/admin/order/permanent/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), permanentDeleteOrder);

export default router;
