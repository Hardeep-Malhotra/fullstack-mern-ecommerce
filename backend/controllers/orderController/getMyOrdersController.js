import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import Order from "../../models/orderModel.js";

// Get Logged-in User Orders -> GET /api/v1/orders/me
export const myOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});
