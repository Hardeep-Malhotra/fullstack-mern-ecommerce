import express from "express";

// Middlewares
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js"; // 👈 Fixed: Added authorizeRoles import
import { validateBody } from "../middlewares/validate.js";

// Validation Schemas
import { createOrderSchema } from "../validators/orderValidator.js";

// Controllers
import { createOrder } from "../controllers/orderController/createOrderController.js";
import { getSingleOrder } from "../controllers/orderController/getSingleOrderController.js";
import { myOrders } from "../controllers/orderController/getMyOrdersController.js";
import { getAllOrders } from "../controllers/orderController/getAllOrdersController.js";
import { updateOrderStatus } from "../controllers/orderController/updateOrderStatusController.js";
import { deleteOrder } from "../controllers/orderController/deleteOrderController.js";
import { cancelOrder } from "../controllers/orderController/cancelOrderController.js";

const router = express.Router();

// ==========================================
// USER ROUTES
// ==========================================

// Create new order (with schema validation)
router
  .route("/order/new")
  .post(isAuthenticatedUser, validateBody(createOrderSchema), createOrder);

// Fetch my orders
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// Fetch single order details
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

// Cancel order (with stock restoration)
router.route("/order/cancel/:id").put(isAuthenticatedUser, cancelOrder);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all orders (Admin dashboard)
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

// Update order status & Delete order
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default router;
