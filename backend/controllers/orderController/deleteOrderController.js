import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";

// Soft Delete Order (Admin) -> DELETE /api/v1/admin/order/:id
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  // Check if order exists AND is not already soft-deleted
  if (!order || order.isDeleted === true) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Set Soft Delete Flags
  order.isDeleted = true;
  order.deletedAt = Date.now();
  order.deletedBy = req.user._id; // Kis admin ne delete kiya, track hoga

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Order deleted (archived) successfully",
  });
});
