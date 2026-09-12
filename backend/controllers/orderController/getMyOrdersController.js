import asyncHandler from "../../middlewares/asyncHandler.js";
import Order from "../../models/orderModel.js";

// =====================================================
// GET LOGGED-IN USER ORDERS
// GET /api/v1/orders/me
//
// Only show orders:
// 1. Belonging to logged-in user
// 2. Not deleted by admin
// 3. Not hidden by the user
// =====================================================

export const myOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,

    // Admin deleted orders should not be visible
    isDeleted: { $ne: true },

    // Orders hidden/removed by user should not be visible
    isHiddenByUser: { $ne: true },
  }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});