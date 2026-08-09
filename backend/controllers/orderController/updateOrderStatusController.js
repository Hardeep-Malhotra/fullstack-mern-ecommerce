import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import Order from "../../models/orderModel.js";

// Update Order Status (Admin) -> PUT /api/v1/admin/order/:id
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(
            new ErrorHandler("This order has already been marked as Delivered", 400),
        );
    }

    const { status } = req.body;

    if (!status) {
        return next(new ErrorHandler("Please provide a valid order status", 400));
    }

    order.orderStatus = status;

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
