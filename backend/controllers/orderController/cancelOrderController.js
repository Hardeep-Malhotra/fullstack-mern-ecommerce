import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
// Cancel Order (User) -> PUT /api/v1/order/cancel/:id
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // 1. Security Check: Order wahi user cancel kar sake jisne create kiya ho
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorHandler("Unauthorized to cancel this order", 403));
  }

  // 2. Business Logic: Shipped ya Delivered orders cancel nahi ho sakte
  if (order.orderStatus === "Delivered" || order.orderStatus === "Shipped") {
    return next(
      new ErrorHandler(
        `Cannot cancel order because it is already ${order.orderStatus}`,
        400,
      ),
    );
  }

  if (order.orderStatus === "Cancelled") {
    return next(new ErrorHandler("Order is already cancelled", 400));
  }

  // 3. 🔄 Stock Restore Logic: Har item ki quantity stock me wapas add karo (+quantity)
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  // 4. Update Status
  order.orderStatus = "Cancelled";
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully and stock restored",
    order,
  });
});
