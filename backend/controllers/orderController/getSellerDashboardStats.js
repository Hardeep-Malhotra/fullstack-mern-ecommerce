

import asyncHandler from "../../middlewares/asyncHandler.js";
import Product from "../../models/productModel.js";
import Order from "../../models/orderModel.js";
import { getCache, setCache } from "../../utils/redisCache.js"; // ⚡ Redis Helper Imports

// =====================================================
// GET SELLER DASHBOARD STATS
// GET /api/v1/seller/stats
// =====================================================

export const getSellerDashboardStats = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const cacheKey = `seller:stats:${sellerId.toString()}`;

  // =====================================================
  // ⚡ 0. REDIS CACHE CHECK
  // =====================================================
  const cachedStats = await getCache(cacheKey);

  if (cachedStats) {
    console.log("⚡ SELLER STATS SERVED FROM REDIS");
    return res.status(200).json({
      success: true,
      stats: cachedStats,
      fromCache: true,
    });
  }

  console.log("🟡 CACHE MISS: CALCULATING FROM MONGODB");

  // =====================================================
  // 1. SELLER PRODUCTS
  // =====================================================

  const sellerProducts = await Product.find({
    seller: sellerId,
  })
    .select("_id name price stock category images createdAt")
    .lean();

  const sellerProductIds = sellerProducts.map((product) => product._id);

  const totalProducts = sellerProducts.length;

  // =====================================================
  // 2. SELLER ORDERS
  // =====================================================

  const sellerOrders = await Order.find({
    "orderItems.seller": sellerId,

    isDeleted: {
      $ne: true,
    },
  })
    .populate("user", "name email")
    .sort({
      createdAt: -1,
    })
    .lean();

  // =====================================================
  // 3. FILTER SELLER ITEMS
  // =====================================================

  const getSellerItems = (order) => {
    return (order.orderItems || []).filter(
      (item) => item.seller && item.seller.toString() === sellerId.toString(),
    );
  };

  // =====================================================
  // 4. BASIC STATS
  // =====================================================

  let totalRevenue = 0;
  let totalSoldItems = 0;

  const uniqueOrderIds = new Set();

  // =====================================================
  // 5. ORDER STATUS
  // =====================================================

  let processing = 0;
  let shipped = 0;
  let delivered = 0;
  let cancelled = 0;

  // =====================================================
  // 6. MONTHLY REVENUE SETUP
  // =====================================================

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyMap = {};

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - i,
      1,
    );

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;

    monthlyMap[key] = {
      month: monthNames[date.getMonth()],
      revenue: 0,
      orders: 0,
      orderIds: new Set(),
    };
  }

  // =====================================================
  // 7. CATEGORY BREAKDOWN SETUP
  // =====================================================

  const categoryMap = {};

  // =====================================================
  // 8. PROCESS ORDERS
  // =====================================================

  sellerOrders.forEach((order) => {
    const sellerItems = getSellerItems(order);

    if (sellerItems.length === 0) {
      return;
    }

    uniqueOrderIds.add(order._id.toString());

    switch (order.orderStatus) {
      case "Processing":
        processing++;
        break;

      case "Shipped":
        shipped++;
        break;

      case "Delivered":
        delivered++;
        break;

      case "Cancelled":
        cancelled++;
        break;

      default:
        break;
    }

    sellerItems.forEach((item) => {
      const price = Number(item.price || 0);

      const quantity = Number(item.quantity || 0);

      if (order.orderStatus !== "Cancelled") {
        totalRevenue += price * quantity;

        totalSoldItems += quantity;
      }

      const product = sellerProducts.find(
        (product) => product._id.toString() === item.product?.toString(),
      );

      const category = product?.category || "Other";

      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          units: 0,
          revenue: 0,
        };
      }

      if (order.orderStatus !== "Cancelled") {
        categoryMap[category].units += quantity;

        categoryMap[category].revenue += price * quantity;
      }
    });

    const createdAt = new Date(order.createdAt);

    const monthKey = `${createdAt.getFullYear()}-${String(
      createdAt.getMonth() + 1,
    ).padStart(2, "0")}`;

    if (monthlyMap[monthKey]) {
      const sellerRevenue =
        order.orderStatus === "Cancelled"
          ? 0
          : sellerItems.reduce(
              (sum, item) =>
                sum + Number(item.price || 0) * Number(item.quantity || 0),
              0,
            );

      monthlyMap[monthKey].revenue += sellerRevenue;

      monthlyMap[monthKey].orderIds.add(order._id.toString());
    }
  });

  // =====================================================
  // 9. TOTAL ORDERS
  // =====================================================

  const totalOrders = uniqueOrderIds.size;

  // =====================================================
  // 10. MONTHLY REVENUE ANALYTICS
  // =====================================================

  const monthlyAnalytics = Object.values(monthlyMap).map((item) => ({
    month: item.month,

    revenue: Math.round(item.revenue * 100) / 100,

    orders: item.orderIds.size,
  }));

  // =====================================================
  // 11. CATEGORY BREAKDOWN
  // =====================================================

  const totalCategoryUnits = Object.values(categoryMap).reduce(
    (sum, category) => sum + category.units,
    0,
  );

  const categoryBreakdown = Object.values(categoryMap)
    .map((category) => ({
      name: category.name,

      value:
        totalCategoryUnits > 0
          ? Math.round((category.units / totalCategoryUnits) * 100)
          : 0,

      units: category.units,

      revenue: Math.round(category.revenue * 100) / 100,
    }))
    .sort((a, b) => b.units - a.units);

  // =====================================================
  // 12. RECENT ORDERS
  // =====================================================

  const recentOrders = sellerOrders.slice(0, 5).map((order) => {
    const sellerItems = getSellerItems(order);

    const sellerTotal =
      order.orderStatus === "Cancelled"
        ? 0
        : sellerItems.reduce(
            (sum, item) =>
              sum + Number(item.price || 0) * Number(item.quantity || 0),
            0,
          );

    const sellerUnits = sellerItems.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );

    return {
      _id: order._id,

      createdAt: order.createdAt,

      orderStatus: order.orderStatus,

      sellerTotal: Math.round(sellerTotal * 100) / 100,

      sellerUnits,

      user: order.user
        ? {
            _id: order.user._id,

            name: order.user.name || "Customer",

            email: order.user.email || "",
          }
        : null,

      items: sellerItems.map((item) => ({
        name: item.name,

        price: item.price,

        quantity: item.quantity,

        image: item.image,

        product: item.product,
      })),
    };
  });

  // =====================================================
  // 13. LOW STOCK PRODUCTS
  // =====================================================

  const lowStockProducts = sellerProducts
    .filter((product) => Number(product.stock || 0) <= 5)
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
    .slice(0, 5);

  // =====================================================
  // 14. INVENTORY
  // =====================================================

  const totalInventoryUnits = sellerProducts.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0,
  );

  const outOfStockProducts = sellerProducts.filter(
    (product) => Number(product.stock || 0) === 0,
  ).length;

  // =====================================================
  // 15. AVERAGE ORDER VALUE
  // =====================================================

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // =====================================================
  // 16. FINAL RESPONSE STATS OBJECT
  // =====================================================

  const stats = {
    totalRevenue: Math.round(totalRevenue * 100) / 100,

    totalOrders,
    totalProducts,
    totalSoldItems,

    averageOrderValue: Math.round(averageOrderValue * 100) / 100,

    totalInventoryUnits,
    outOfStockProducts,

    monthlyAnalytics,
    categoryBreakdown,

    orderStatus: {
      processing,
      shipped,
      delivered,
      cancelled,
    },

    recentOrders,
    lowStockProducts,
  };

  // =====================================================
  // ⚡ 17. SAVE STATS TO REDIS (5 Min TTL)
  // =====================================================
  await setCache(cacheKey, stats, 300);
  console.log("🟢 SELLER STATS SAVED TO REDIS CACHE");

  // =====================================================
  // SEND RESPONSE
  // =====================================================

  res.status(200).json({
    success: true,
    stats,
    fromCache: false,
  });
});
