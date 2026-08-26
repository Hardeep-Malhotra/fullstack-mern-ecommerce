import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/userModel.js";

// GET /api/v1/admin/dashboard
export const getAdminDashboardStats = async (req, res) => {
  try {
    // 1. Total Counts Fetching
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // 2. Order Status Breakdown
    const processing = await Order.countDocuments({
      orderStatus: "Processing",
    });
    const shipped = await Order.countDocuments({ orderStatus: "Shipped" });
    const delivered = await Order.countDocuments({ orderStatus: "Delivered" });
    const cancelled = await Order.countDocuments({ orderStatus: "Cancelled" });

    // 3. Total Revenue Calculation (Only non-cancelled orders)
    const revenueData = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // 4. Recent Orders (Latest 5-10 orders with user details)
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Low Stock Products (Stock <= 5 or threshold)
    const lowStockProducts = await Product.find({ Stock: { $lte: 5 } })
      .select("name Stock price images")
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        processing,
        shipped,
        delivered,
        cancelled,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};
