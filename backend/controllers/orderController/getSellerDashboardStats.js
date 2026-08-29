import asyncHandler from "../../middlewares/asyncHandler.js";
import Product from "../../models/productModel.js";
import Order from "../../models/orderModel.js";

// =====================================================
// GET SELLER DASHBOARD STATS
// GET /api/v1/seller/stats
// =====================================================

export const getSellerDashboardStats = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  console.log("=================================");
  console.log("🔥 SELLER DASHBOARD STATS");
  console.log("SELLER ID:", sellerId);
  console.log("SELLER ROLE:", req.user.role);
  console.log("=================================");

  // =====================================================
  // 1. GET SELLER PRODUCTS
  // IMPORTANT: Product field is "seller", NOT "user"
  // =====================================================

  const sellerProducts = await Product.find({
    seller: sellerId,
  }).select("_id");

  const sellerProductIds = sellerProducts.map(
    (product) => product._id
  );

  console.log(
    "🟠 SELLER PRODUCT IDS:",
    sellerProductIds
  );

  // =====================================================
  // 2. TOTAL PRODUCTS
  // =====================================================

  const totalProducts = sellerProductIds.length;

  // =====================================================
  // 3. GET ORDERS CONTAINING SELLER PRODUCTS
  // =====================================================

  const sellerOrders = await Order.find({
    "orderItems.product": {
      $in: sellerProductIds,
    },
    isDeleted: {
      $ne: true,
    },
  });

  console.log(
    "🟢 SELLER ORDERS FOUND:",
    sellerOrders.length
  );

  // =====================================================
  // 4. CALCULATE REVENUE + UNITS SOLD
  // =====================================================

  let totalRevenue = 0;
  let totalSoldItems = 0;

  sellerOrders.forEach((order) => {
    order.orderItems.forEach((item) => {
      const isSellerProduct = sellerProductIds.some(
        (productId) =>
          productId.toString() ===
          item.product.toString()
      );

      if (isSellerProduct) {
        totalRevenue +=
          Number(item.price || 0) *
          Number(item.quantity || 0);

        totalSoldItems += Number(
          item.quantity || 0
        );
      }
    });
  });

  // =====================================================
  // 5. RESPONSE
  // =====================================================

  const stats = {
    totalRevenue:
      Math.round(totalRevenue * 100) / 100,

    totalOrders: sellerOrders.length,

    totalProducts,

    totalSoldItems,
  };

  console.log("🟢 SELLER STATS:", stats);

  res.status(200).json({
    success: true,
    stats,
  });
});