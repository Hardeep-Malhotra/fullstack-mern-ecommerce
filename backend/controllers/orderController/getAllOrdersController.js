import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";

// Get All Orders (Admin) -> GET /api/v1/admin/orders
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({
    isDeleted: { $ne: true },
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  // Prevent floating point issue using Number rounding
  const totalAmount = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

  res.status(200).json({
    success: true,
    totalAmount: Math.round(totalAmount * 100) / 100,
    count: orders.length,
    orders,
  });
});