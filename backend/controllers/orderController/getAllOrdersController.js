import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import Order from "../../models/orderModel.js";



// Get All Orders (Admin) -> GET /api/v1/admin/orders
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({isDeleted: { $ne: true }}).sort({ createdAt: -1 });

  // Dashboard metric: Calculate total revenue from all orders
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    count: orders.length,
    orders,
  });
});
