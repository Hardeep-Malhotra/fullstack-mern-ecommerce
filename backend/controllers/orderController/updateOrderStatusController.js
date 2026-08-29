// import asyncHandler from "../../middlewares/asyncHandler.js";
// import ErrorHandler from "../../utils/errorHandler.js";
// import Order from "../../models/orderModel.js";

// // Allowed status values match enum in orderModel.js
// const ALLOWED_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

// // Update Order Status (Admin) -> PUT /api/v1/admin/order/:id
// export const updateOrderStatus = asyncHandler(async (req, res, next) => {
//   const { status } = req.body;

//   if (!status || !ALLOWED_STATUSES.includes(status)) {
//     return next(
//       new ErrorHandler(
//         `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
//         400,
//       ),
//     );
//   }

//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return next(new ErrorHandler("Order not found with this ID", 404));
//   }

//   // 1. Guard: Delivered order cannot be updated further
//   if (order.orderStatus === "Delivered") {
//     return next(
//       new ErrorHandler("This order has already been marked as Delivered", 400),
//     );
//   }

//   // 2. Guard: Cancelled order status cannot be changed
//   if (order.orderStatus === "Cancelled") {
//     return next(
//       new ErrorHandler("Cannot change status of a Cancelled order", 400),
//     );
//   }

//   // 3. Update Current Status
//   order.orderStatus = status;

//   // 4. Push Audit Entry to statusHistory Array
//   order.statusHistory.push({
//     status,
//     comment: req.body.comment || `Order status updated to ${status}`, 
//     updatedAt: Date.now(),
//     updatedBy: req.user._id,
//   });

//   // 5. Set Delivery Timestamp if status is Delivered
//   if (status === "Delivered") {
//     order.deliveredAt = Date.now();
//   }

//   await order.save({ validateBeforeSave: false });

//   res.status(200).json({
//     success: true,
//     message: `Order status updated to ${status}`,
//     order,
//   });
// });


import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";

// Allowed status values match enum in orderModel.js
const ALLOWED_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

// Update Order Status (Seller & Admin) -> PUT /api/v1/seller/order/:id OR /api/v1/admin/order/:id
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, comment } = req.body;

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return next(
      new ErrorHandler(
        `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
        400
      )
    );
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Multi-Vendor Guard: Check if seller owns at least one item in this order
  if (req.user.role === "seller") {
    const isSellerProductOwner = order.orderItems.some(
      (item) => item.seller.toString() === req.user._id.toString()
    );

    if (!isSellerProductOwner) {
      return next(
        new ErrorHandler(
          "Access denied: You are not authorized to update this order",
          403
        )
      );
    }
  }

  // Guard 1: Delivered order status transition check
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("This order has already been marked as Delivered", 400)
    );
  }

  // Guard 2: Cancelled order status transition check
  if (order.orderStatus === "Cancelled") {
    return next(
      new ErrorHandler("Cannot change status of a Cancelled order", 400)
    );
  }

  // Update Status
  order.orderStatus = status;

  // Push Audit Log Entry
  order.statusHistory.push({
    status,
    comment: comment || `Order status updated to ${status} by ${req.user.role}`,
    updatedAt: Date.now(),
    updatedBy: req.user._id,
  });

  // Set Delivery Timestamp
  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    order,
  });
});