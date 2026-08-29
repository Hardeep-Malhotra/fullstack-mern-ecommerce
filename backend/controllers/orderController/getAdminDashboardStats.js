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

    // 4. Monthly Revenue Calculation (For Recharts Area Chart)
    const monthlyRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Month Names Mapping Array
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Format monthly data for frontend
    const formattedMonthlyRevenue = monthlyRevenue.map((item) => ({
      month: monthNames[item._id - 1] || "N/A",
      revenue: item.revenue,
    }));

    // 5. Recent Orders (Latest 5 orders with user details)
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Low Stock Products Fix: Check both 'stock' and 'Stock' fields cleanly
    const lowStockProducts = await Product.find({
      $or: [{ stock: { $lte: 5 } }, { Stock: { $lte: 5 } }],
    })
      .select("name stock Stock price images")
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
      monthlyRevenue: formattedMonthlyRevenue,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    let query = {};
    
    // Agar Request Seller Kar Raha Hai, Toh Only Unke Own Products Dikhao
    if (req.user.role === "seller") {
      query.user = req.user._id;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};