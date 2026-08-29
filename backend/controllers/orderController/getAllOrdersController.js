import asyncHandler from "../../middlewares/asyncHandler.js";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";

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
    console.log("🟠 SELLER ID:", req.user._id);

    // Seller ke products nikalo
    // IMPORTANT: Product me seller field hai, user nahi
    const sellerProductIds = await Product.find({
      seller: req.user._id,
    }).distinct("_id");

    console.log("🟠 SELLER PRODUCT IDS:", sellerProductIds);

    // Agar seller ke products hi nahi hain
    if (sellerProductIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        totalAmount: 0,
        orders: [],
      });
    }

    // Seller ke products wale orders find karo
    orders = await Order.find({
      "orderItems.product": {
        $in: sellerProductIds,
      },

      isDeleted: {
        $ne: true,
      },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    console.log("🟢 SELLER ORDERS FOUND:", orders.length);
  }

  // =====================================================
  // ADMIN
  // =====================================================

  else if (req.user?.role === "admin") {
    console.log("🔵 ADMIN ORDERS REQUEST");

    orders = await Order.find({
      isDeleted: {
        $ne: true,
      },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    console.log("🔵 ADMIN ORDERS FOUND:", orders.length);
  }

  // =====================================================
  // TOTAL AMOUNT
  // =====================================================

  const totalAmount = orders.reduce(
    (acc, order) => acc + Number(order.totalPrice || 0),
    0
  );

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