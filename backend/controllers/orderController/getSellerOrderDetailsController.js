import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";

// =====================================================
// GET SELLER ORDER DETAILS
// GET /api/v1/seller/orders/:id
// Seller can only view orders containing their products
// =====================================================

export const getSellerOrderDetails = asyncHandler(
  async (req, res, next) => {
    const sellerId = req.user._id;
    const orderId = req.params.id;

    console.log("🔥 SELLER ORDER DETAILS CONTROLLER");
    console.log("Seller ID:", sellerId);
    console.log("Order ID:", orderId);

    // -------------------------------------------------
    // Find order
    // -------------------------------------------------

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("orderItems.product", "name price images");

    if (!order) {
      return next(
        new ErrorHandler(
          "Order not found with this ID",
          404
        )
      );
    }

    // -------------------------------------------------
    // Check whether this seller owns any product
    // in this order
    // -------------------------------------------------

    const sellerOwnsOrder = order.orderItems.some(
      (item) =>
        item.seller &&
        item.seller.toString() === sellerId.toString()
    );

    console.log("Seller owns order:", sellerOwnsOrder);

    if (!sellerOwnsOrder) {
      return next(
        new ErrorHandler(
          "You are not authorized to view this order",
          403
        )
      );
    }

    // -------------------------------------------------
    // Return order
    // -------------------------------------------------

    res.status(200).json({
      success: true,
      order,
    });
  }
);