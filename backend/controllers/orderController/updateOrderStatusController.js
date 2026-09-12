import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";

import User from "../../models/userModel.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { orderStatusEmailTemplate } from "../../utils/emailTemplates.js";

// ==========================================
// ALLOWED STATUS VALUES
// ==========================================

const ALLOWED_STATUSES = ["Processing", "Shipped", "Delivered"];

// ==========================================
// VALID STATUS TRANSITIONS
// ==========================================

const VALID_STATUS_TRANSITIONS = {
  Processing: ["Shipped"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

// ==========================================
// UPDATE ORDER STATUS
// PUT /api/v1/seller/order/:id
// PUT /api/v1/admin/order/:id
// ==========================================

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, comment } = req.body;

  // ==========================================
  // 1. VALIDATE STATUS
  // ==========================================

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return next(
      new ErrorHandler(
        `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
        400,
      ),
    );
  }

  // ==========================================
  // 2. FIND ORDER
  // ==========================================

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // ==========================================
  // 3. MULTI-VENDOR SECURITY CHECK
  // ==========================================

  if (req.user.role === "seller") {
    const isSellerProductOwner = order.orderItems.some(
      (item) =>
        item.seller && item.seller.toString() === req.user._id.toString(),
    );

    if (!isSellerProductOwner) {
      return next(
        new ErrorHandler(
          "Access denied: You are not authorized to update this order",
          403,
        ),
      );
    }
  }

  // ==========================================
  // 4. PREVENT UPDATE OF FINAL STATES
  // ==========================================

  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("This order has already been marked as Delivered", 400),
    );
  }

  if (order.orderStatus === "Cancelled") {
    return next(
      new ErrorHandler("Cannot change status of a Cancelled order", 400),
    );
  }

  // ==========================================
  // 5. VALIDATE STATUS TRANSITION
  // ==========================================

  const allowedNextStatuses = VALID_STATUS_TRANSITIONS[order.orderStatus] || [];

  if (!allowedNextStatuses.includes(status)) {
    return next(
      new ErrorHandler(
        `Cannot change order status from ${order.orderStatus} to ${status}`,
        400,
      ),
    );
  }

  // ==========================================
  // 6. UPDATE ORDER STATUS
  // ==========================================

  order.orderStatus = status;

  // ==========================================
  // 7. INITIALIZE STATUS HISTORY
  // ==========================================

  if (!order.statusHistory) {
    order.statusHistory = [];
  }

  // ==========================================
  // 8. ADD STATUS HISTORY
  // ==========================================

  order.statusHistory.push({
    status,

    comment: comment || `Order status updated to ${status} by ${req.user.role}`,

    updatedAt: new Date(),

    updatedBy: req.user._id,
  });

  // ==========================================
  // 9. SET DELIVERY TIMESTAMP
  // ==========================================

  if (status === "Delivered") {
    order.deliveredAt = new Date();
  }

  // ==========================================
  // 10. SAVE ORDER
  // ==========================================

  await order.save({
    validateBeforeSave: false,
  });

  // ==========================================
  // 11. SEND EMAIL TO CUSTOMER
  // ==========================================

  try {
    const user = await User.findById(order.user);

    if (user) {
      await sendEmail({
        email: user.email,

        subject: `Order Status Updated - ${status}`,

        html: orderStatusEmailTemplate(user.name, order, status, comment),

        message: `Your order ${order._id} status has been updated to ${status}.`,
      });

      console.log(`📧 Order status email sent successfully to: ${user.email}`);
    } else {
      console.log(`⚠️ Customer not found for order: ${order._id}`);
    }
  } catch (emailError) {
    // Email failure should NOT rollback order status

    console.error("❌ Order Status Email Failed:", emailError.message);
  }

  // ==========================================
  // 12. RESPONSE
  // ==========================================

  res.status(200).json({
    success: true,

    message: `Order status updated to ${status}`,

    order,
  });
});
