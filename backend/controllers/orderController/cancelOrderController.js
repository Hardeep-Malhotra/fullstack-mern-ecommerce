import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";

import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/userModel.js";

import { sendEmail } from "../../utils/sendEmail.js";

import {
  orderCancelledEmailTemplate,
} from "../../utils/emailTemplates.js";


// ==========================================================
// CANCEL ORDER (USER / ADMIN)
// PUT /api/v1/order/cancel/:id
// ==========================================================

export const cancelOrder = asyncHandler(async (req, res, next) => {

  // ==========================================================
  // 1. FIND ORDER
  // ==========================================================

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorHandler("Order not found with this ID", 404)
    );
  }


  // ==========================================================
  // 2. SECURITY CHECK
  // ==========================================================

  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorHandler(
        "Unauthorized to cancel this order",
        403
      )
    );
  }


  // ==========================================================
  // 3. STATUS CHECK
  // ==========================================================

  const currentStatus = String(
    order.orderStatus || ""
  )
    .toLowerCase()
    .trim();


  // Already Cancelled

  if (currentStatus === "cancelled") {
    return next(
      new ErrorHandler(
        "Order is already cancelled",
        400
      )
    );
  }


  // Shipped / Delivered orders cancel nahi ho sakte

  if (
    currentStatus === "shipped" ||
    currentStatus === "delivered"
  ) {
    return next(
      new ErrorHandler(
        `Cannot cancel order because it is already ${order.orderStatus}`,
        400
      )
    );
  }


  // ==========================================================
  // 4. GET CANCELLATION REASON
  // ==========================================================

  const { reason, comment } = req.body;


  if (!reason || !reason.trim()) {
    return next(
      new ErrorHandler(
        "Cancellation reason is required",
        400
      )
    );
  }


  // ==========================================================
  // 5. RESTORE PRODUCT STOCK
  // ==========================================================

  for (const item of order.orderItems) {

    await Product.findByIdAndUpdate(
      item.product,
      {
        $inc: {
          stock: item.quantity,
        },
      }
    );

  }


  // ==========================================================
  // 6. UPDATE ORDER
  // ==========================================================

  order.orderStatus = "Cancelled";

  order.cancelReason = reason.trim();

  order.cancelComment =
    comment?.trim() || null;


  // ==========================================================
  // 7. STATUS HISTORY
  // ==========================================================

  if (!order.statusHistory) {
    order.statusHistory = [];
  }


  order.statusHistory.push({

    status: "Cancelled",

    comment: `Order cancelled by ${
      req.user.role === "admin"
        ? "admin"
        : "customer"
    }: ${reason.trim()}${
      comment?.trim()
        ? ` - ${comment.trim()}`
        : ""
    }`,

    updatedBy: req.user._id,

    updatedAt: new Date(),

  });


  // ==========================================================
  // 8. SAVE ORDER
  // ==========================================================

  await order.save({
    validateBeforeSave: false,
  });


  // ==========================================================
  // 9. SEND ORDER CANCELLED EMAIL
  // ==========================================================

  try {

    const user = await User.findById(
      order.user
    ).select("name email");


    if (user) {

      await sendEmail({

        email: user.email,

        subject:
          "Your NexusCart AI Order Has Been Cancelled ❌",


        html: orderCancelledEmailTemplate(

          user.name,

          order,

          order.cancelReason,

          order.cancelComment

        ),


        message: `Hello ${user.name}, your order ${order._id} has been cancelled. Reason: ${order.cancelReason}`,

      });


      console.log(
        "📧 Order cancellation email sent to:",
        user.email
      );

    }

  } catch (emailError) {

    // Email fail hone se order cancellation fail nahi hogi

    console.error(
      "❌ Order Cancellation Email Failed:",
      emailError.message
    );

  }


  // ==========================================================
  // 10. SUCCESS RESPONSE
  // ==========================================================

  res.status(200).json({

    success: true,

    message:
      "Order cancelled successfully, stock restored and notification email sent",

    order,

  });

});