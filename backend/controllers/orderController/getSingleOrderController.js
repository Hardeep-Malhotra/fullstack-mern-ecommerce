import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import Order from "../../models/orderModel.js";

// Get Single Order Details -> GET /api/v1/order/:id
export const getSingleOrder = asyncHandler(async (req, res, next) => {
  // populate() se user object me name aur email populate ho jayega
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Security check: Order sirf wahi user dekh sake jisne order kiya ho (ya Admin)
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorHandler("Unauthorized to view this order details", 403),
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});
