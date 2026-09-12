// import asyncHandler from "../../middlewares/asyncHandler.js";
// import ErrorHandler from "../../utils/errorHandler.js";
// import Order from "../../models/orderModel.js";

// // =====================================================
// // GET SELLER ORDER DETAILS
// // GET /api/v1/seller/orders/:id
// // Seller can only view orders containing their products
// // =====================================================

// export const getSellerOrderDetails = asyncHandler(async (req, res, next) => {
//   const sellerId = req.user._id;
//   const orderId = req.params.id;

//   const order = await Order.findById(orderId)
//     .populate("user", "name email")
//     .populate("orderItems.product", "name price images");

//   if (!order) {
//     return next(new ErrorHandler("Order not found with this ID", 404));
//   }

//   // Sirf isi seller ke items filter karo
//   const sellerItems = order.orderItems.filter(
//     (item) => item.seller && item.seller.toString() === sellerId.toString()
//   );

//   if (sellerItems.length === 0) {
//     return next(
//       new ErrorHandler("You are not authorized to view this order", 403)
//     );
//   }

//   // Seller ka apna revenue calculate karo, poore order ka nahi
//   const sellerTotal = sellerItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   const sellerOrderView = {
//     _id: order._id,
//     user: order.user,
//     shippingInfo: order.shippingInfo,
//     orderStatus: order.orderStatus,
//     createdAt: order.createdAt,
//     paidAt: order.paidAt,
//     paymentInfo: order.paymentInfo,
//     statusHistory: order.statusHistory,
//     orderItems: sellerItems,   // ← sirf apne items
//     itemsTotal: sellerTotal,   // ← sirf apna revenue
//   };

//   res.status(200).json({
//     success: true,
//     order: sellerOrderView,
//   });
// });

import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";

// =====================================================
// GET SELLER ORDER DETAILS
// GET /api/v1/seller/orders/:id
// Seller can only view orders containing their products,
// and only sees their own items/revenue within that order
// (multi-vendor orders must not leak other sellers' data).
// =====================================================

export const getSellerOrderDetails = asyncHandler(
  async (req, res, next) => {
    const sellerId = req.user._id;
    const orderId = req.params.id;

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
    // FIX: filter to only this seller's items — previously
    // the whole order (including other sellers' items and
    // totals) was returned once ANY item matched.
    // -------------------------------------------------

    const sellerItems = order.orderItems.filter(
      (item) =>
        item.seller &&
        item.seller.toString() === sellerId.toString()
    );

    if (sellerItems.length === 0) {
      return next(
        new ErrorHandler(
          "You are not authorized to view this order",
          403
        )
      );
    }

    // -------------------------------------------------
    // Seller's own revenue for this order, not the
    // full multi-vendor order total.
    // -------------------------------------------------

    const sellerItemsTotal = sellerItems.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    // -------------------------------------------------
    // Build a seller-scoped view of the order — shipping,
    // customer, payment and status info stay the same
    // (needed for fulfilment), but orderItems/totals are
    // scoped to this seller only.
    // -------------------------------------------------

    const sellerOrderView = {
      _id: order._id,
      user: order.user,
      shippingInfo: order.shippingInfo,
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      paymentInfo: order.paymentInfo,
      paidAt: order.paidAt,
      createdAt: order.createdAt,
      orderItems: sellerItems,
      itemsTotal: sellerItemsTotal,
    };

    res.status(200).json({
      success: true,
      order: sellerOrderView,
    });
  }
);