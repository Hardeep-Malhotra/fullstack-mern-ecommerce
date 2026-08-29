import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";

// =====================================================
// GET SINGLE ORDER
// USER / ADMIN
// GET /api/v1/order/:id
// =====================================================

export const getSingleOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return next(
      new ErrorHandler("Order not found with this ID", 404),
    );
  }

  // Normal customer -> only own order
  if (
    order.user?._id?.toString() !==
      req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorHandler(
        "Unauthorized to view this order details",
        403,
      ),
    );
  }

  return res.status(200).json({
    success: true,
    order,
  });
});