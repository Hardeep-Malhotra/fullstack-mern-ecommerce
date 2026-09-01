import asyncHandler from "../../middlewares/asyncHandler.js";
import Order from "../../models/orderModel.js";

// =====================================================
// GET ALL ORDERS
//
// ADMIN  -> All orders
// SELLER -> Only orders containing seller's products
//
// GET /api/v1/seller/orders
// GET /api/v1/admin/orders
// =====================================================

export const getAllOrders = asyncHandler(async (req, res, next) => {
  let orders = [];

  // =====================================================
  // SELLER
  // =====================================================
  if (req.user?.role === "seller") {
    // Direct DB query on embedded seller field with lean optimization
    orders = await Order.find({
      "orderItems.seller": req.user._id,
      isDeleted: { $ne: true },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();
  }

  // =====================================================
  // ADMIN
  // =====================================================
  else if (req.user?.role === "admin") {
    orders = await Order.find({
      isDeleted: { $ne: true },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();
  }

  // =====================================================
  // TOTAL AMOUNT & SELLER FILTERING
  // =====================================================
  let totalAmount = 0;

  if (req.user?.role === "seller") {
    // Calculate total only for this seller's items in orders
    orders = orders.map((order) => {
      const sellerItems = (order.orderItems || []).filter(
        (item) => item.seller && item.seller.toString() === req.user._id.toString()
      );

      const sellerTotal = sellerItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      );

      if (order.orderStatus !== "Cancelled") {
        totalAmount += sellerTotal;
      }

      return {
        ...order,
        orderItems: sellerItems,
        sellerTotal: Math.round(sellerTotal * 100) / 100,
      };
    });
  } else {
    // Admin Total Calculation
    totalAmount = orders.reduce(
      (acc, order) => (order.orderStatus !== "Cancelled" ? acc + Number(order.totalPrice || 0) : acc),
      0
    );
  }

  // =====================================================
  // RESPONSE
  // =====================================================
  res.status(200).json({
    success: true,
    count: orders.length,
    totalAmount: Math.round(totalAmount * 100) / 100,
    orders,
  });
});