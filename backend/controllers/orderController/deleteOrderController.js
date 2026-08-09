import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import Order from "../../models/orderModel.js";

// Delete Order (Admin) -> DELETE /api/v1/admin/order/:id
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
