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
// USER ROUTES (Static / Specific Action Routes First)
// ==========================================

// 1. Create Order
router
  .route("/order/new")
  .post(isAuthenticatedUser, validateBody(createOrderSchema), createOrder);

// 2. Get My Orders
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// 3. Cancel Order
router.route("/order/cancel/:id").put(isAuthenticatedUser, cancelOrder);

// 4. Hide Order From User History
router.route("/order/my/:id").delete(isAuthenticatedUser, deleteMyOrder);

// 5. Dynamic Single Order (ALWAYS KEEP THIS AT THE END OF USER ROUTES)
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get All Orders
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

// Get Deleted Orders (Trash)
router
  .route("/admin/orders/deleted")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getDeletedOrders);

// Empty Trash
router
  .route("/admin/orders/trash/empty")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), emptyTrash);

// Restore Order
router
  .route("/admin/order/restore/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), restoreOrder);

// Permanently Delete Order
router
  .route("/admin/order/permanent/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), permanentDeleteOrder);

// Update / Soft Delete Order
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default router;