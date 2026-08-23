import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";

// Cancel Order (User)
// PUT /api/v1/order/cancel/:id
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // ==========================================================
  // 1. SECURITY CHECK
  // ==========================================================
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorHandler("Unauthorized to cancel this order", 403));
  }

  // ==========================================================
  // 2. SAFE CASE-INSENSITIVE STATUS CHECK (FIXED HERE)
  // ==========================================================
  const currentStatus = String(order.orderStatus || "")
    .toLowerCase()
    .trim();

  // Shipped / Delivered orders cancel nahi ho sakte
  if (currentStatus === "shipped" || currentStatus === "delivered") {
    return next(
      new ErrorHandler(
        `Cannot cancel order because it is already ${order.orderStatus}`,
        400,
      ),
    );
  }

  // Already cancelled check
  if (currentStatus === "cancelled") {
    return next(new ErrorHandler("Order is already cancelled", 400));
  }

  // ==========================================================
  // 3. GET CANCELLATION REASON
  // ==========================================================
  const { reason, comment } = req.body;

  if (!reason || !reason.trim()) {
    return next(new ErrorHandler("Cancellation reason is required", 400));
  }

  // ==========================================================
  // 4. RESTORE PRODUCT STOCK
  // ==========================================================
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: item.quantity,
      },
    });
  }

  // ==========================================================
  // 5. UPDATE ORDER
  // ==========================================================
  order.orderStatus = "Cancelled";
  order.cancelReason = reason.trim();
  order.cancelComment = comment?.trim() || null;

  // ==========================================================
  // 6. STATUS HISTORY
  // ==========================================================
  if (!order.statusHistory) {
    order.statusHistory = [];
  }

  order.statusHistory.push({
    status: "Cancelled",
    comment: `Order cancelled by ${
      req.user.role === "admin" ? "admin" : "customer"
    }: ${reason.trim()}${comment?.trim() ? ` - ${comment.trim()}` : ""}`,
    updatedBy: req.user._id,
    updatedAt: new Date(),
  });

  // ==========================================================
  // 7. SAVE ORDER
  // ==========================================================
  await order.save({
    validateBeforeSave: false,
  });

  // ==========================================================
  // 8. RESPONSE
  // ==========================================================
  res.status(200).json({
    success: true,
    message: "Order cancelled successfully and stock restored",
    order,
  });
});
