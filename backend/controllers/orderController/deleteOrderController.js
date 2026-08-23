import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";

// ==========================================================
// Soft Delete Order (Admin) -> DELETE /api/v1/admin/order/:id
// Moves order to "Trash" (isDeleted: true)
// ==========================================================
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order || order.isDeleted === true) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  order.isDeleted = true;
  order.deletedAt = Date.now();
  order.deletedBy = req.user._id;

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Order deleted (archived) successfully",
  });
});

// ==========================================================
// User Deletes Their Own Order -> DELETE /api/v1/order/my/:id
// Only removes it from the user's own "My Orders" view (soft delete)
// User can only delete their OWN order — ownership check included
// ==========================================================
export const deleteMyOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order || order.isDeleted === true) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Ownership check — user can only delete their own order
  if (order.user.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete this order", 403),
    );
  }

  order.isDeleted = true;
  order.deletedAt = Date.now();
  order.deletedBy = req.user._id; // yaha user khud hoga, admin nahi

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Order removed from your order history",
  });
});

// ==========================================================
// Get All Soft-Deleted Orders (Admin) -> GET /api/v1/admin/orders/deleted
// "Trash" list — shows id for restore or permanent delete
// ==========================================================
export const getDeletedOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ isDeleted: true }).sort({ deletedAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// ==========================================================
// Restore Soft-Deleted Order (Admin) -> PUT /api/v1/admin/order/restore/:id
// ==========================================================
export const restoreOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order || order.isDeleted !== true) {
    return next(new ErrorHandler("Deleted order not found with this ID", 404));
  }

  order.isDeleted = false;
  order.deletedAt = undefined;
  order.deletedBy = undefined;

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Order restored successfully",
    order,
  });
});

// ==========================================================
// Permanently Delete ONE Order (Admin) -> DELETE /api/v1/admin/order/permanent/:id
// Only allowed if it's already in Trash (isDeleted: true)
// Hard delete — cannot be undone
// ==========================================================
export const permanentDeleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  if (order.isDeleted !== true) {
    return next(
      new ErrorHandler(
        "Order must be moved to Trash before it can be permanently deleted",
        400,
      ),
    );
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order permanently deleted",
  });
});

// ==========================================================
// Empty Trash — Permanently Delete ALL Soft-Deleted Orders
// -> DELETE /api/v1/admin/orders/trash/empty
// Hard delete — cannot be undone
// ==========================================================
export const emptyTrash = asyncHandler(async (req, res, next) => {
  const result = await Order.deleteMany({ isDeleted: true });

  res.status(200).json({
    success: true,
    message: `Trash emptied — ${result.deletedCount} order(s) permanently deleted`,
    deletedCount: result.deletedCount,
  });
});
