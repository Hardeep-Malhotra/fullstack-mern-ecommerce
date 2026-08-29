import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";

// =====================================================
// GET SELLER ORDER DETAILS
// Seller can see ONLY his own products
//
// GET /api/v1/seller/orders/:id
// =====================================================

export const getSellerOrderDetails = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    console.log("=================================");
    console.log("🔥 SELLER ORDER DETAILS");
    console.log("ORDER ID:", id);
    console.log("SELLER ID:", req.user?._id);
    console.log("SELLER ROLE:", req.user?.role);
    console.log("=================================");

    // =====================================================
    // FIND ORDER
    // =====================================================

    const order = await Order.findById(id)
      .populate("user", "name email")
      .lean();

    if (!order) {
      return next(
        new ErrorHandler(
          "Order not found with this ID",
          404,
        ),
      );
    }

    // =====================================================
    // SELLER ID
    // =====================================================

    const sellerId = req.user._id.toString();

    // =====================================================
    // FIND SELLER'S ITEMS
    // =====================================================

    const sellerItems = (order.orderItems || []).filter(
      (item) =>
        item.seller &&
        item.seller.toString() === sellerId,
    );

    console.log(
      "🟠 SELLER ITEMS:",
      sellerItems.length,
    );

    // =====================================================
    // SELLER PRODUCT NOT FOUND IN ORDER
    // =====================================================

    if (sellerItems.length === 0) {
      return next(
        new ErrorHandler(
          "This order does not contain any of your products",
          403,
        ),
      );
    }

    // =====================================================
    // SELLER-SPECIFIC ORDER
    // =====================================================

    const sellerOrder = {
      ...order,

      // IMPORTANT:
      // Seller ko sirf apne products dikhao
      orderItems: sellerItems,

      // Seller-specific total
      itemsPrice: sellerItems.reduce(
        (total, item) =>
          total +
          Number(item.price || 0) *
            Number(item.quantity || 0),
        0,
      ),
    };

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      order: sellerOrder,
    });
  },
);