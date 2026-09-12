import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";

// ==========================================================
// ADMIN SOFT DELETE
// DELETE /api/v1/admin/order/:id
// Moves order to Trash
// ==========================================================

export const deleteOrder = asyncHandler(async (req, res, next) => {

  const order = await Order.findById(req.params.id);

  if (!order || order.isDeleted === true) {

    return next(
      new ErrorHandler("Order not found with this ID", 404)
    );

  }


  // Move order to trash
  order.isDeleted = true;

  order.deletedAt = new Date();

  order.deletedBy = req.user._id;


  await order.save({
    validateBeforeSave: false,
  });


  res.status(200).json({

    success: true,

    message: "Order moved to trash successfully",

  });

});


// ==========================================================
// USER HIDE OWN ORDER
// DELETE /api/v1/order/my/:id
// Removes order only from user's My Orders history
// ==========================================================

export const deleteMyOrder = asyncHandler(async (req, res, next) => {

  const order = await Order.findById(req.params.id);


  // Order not found OR admin deleted
  if (!order || order.isDeleted === true) {

    return next(
      new ErrorHandler("Order not found with this ID", 404)
    );

  }


  // ==========================================================
  // OWNERSHIP CHECK
  // ==========================================================

  if (
    order.user.toString() !==
    req.user._id.toString()
  ) {

    return next(
      new ErrorHandler(
        "You are not authorized to remove this order",
        403
      )
    );

  }


  // ==========================================================
  // ALREADY HIDDEN CHECK
  // ==========================================================

  if (order.isHiddenByUser === true) {

    return next(
      new ErrorHandler(
        "Order is already removed from your order history",
        400
      )
    );

  }


  // ==========================================================
  // ACTIVE ORDER CHECK (FIX)
  // Processing/Shipped orders are still "in progress" — hiding
  // them here would make the customer lose visibility into an
  // order that isn't finished yet. Only Delivered or Cancelled
  // (final states) can be removed from history.
  // ==========================================================

  if (
    order.orderStatus === "Processing" ||
    order.orderStatus === "Shipped"
  ) {

    return next(
      new ErrorHandler(
        order.orderStatus === "Processing"
          ? "This order is still Processing. Cancel it first if you no longer want it, then you can remove it from your history."
          : "This order has been Shipped and is on its way. Please wait until it's delivered before removing it from your history.",
        400
      )
    );

  }


  // ==========================================================
  // HIDE ORDER ONLY FOR USER
  // ==========================================================

  order.isHiddenByUser = true;

  order.hiddenByUserAt = new Date();


  await order.save({
    validateBeforeSave: false,
  });


  res.status(200).json({

    success: true,

    message:
      "Order removed from your order history successfully",

  });

});


// ==========================================================
// GET ALL DELETED / HIDDEN ORDERS (ADMIN TRASH)
// GET /api/v1/admin/orders/deleted
// ==========================================================
export const getDeletedOrders = asyncHandler(async (req, res, next) => {
  // Admin Trash mein dono aayenge: Admin deleted OR User hidden
  const orders = await Order.find({
    $or: [{ isDeleted: true }, { isHiddenByUser: true }],
  })
    .populate("user", "name email")
    .populate("deletedBy", "name email")
    .sort({
      deletedAt: -1,
      hiddenByUserAt: -1,
    });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// ==========================================================
// RESTORE ORDER FROM TRASH (ADMIN)
// PUT /api/v1/admin/order/restore/:id
// ==========================================================
export const restoreOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order || (!order.isDeleted && !order.isHiddenByUser)) {
    return next(
      new ErrorHandler("Deleted or hidden order not found with this ID", 404)
    );
  }

  // Restore for both Admin & User
  order.isDeleted = false;
  order.deletedAt = null;
  order.deletedBy = null;

  order.isHiddenByUser = false;
  order.hiddenByUserAt = null;

  await order.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
    message: "Order restored successfully",
    order,
  });
});

// ==========================================================
// PERMANENTLY DELETE ONE ORDER (ADMIN)
// DELETE /api/v1/admin/order/permanent/:id
// ==========================================================
export const permanentDeleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Trash or User-hidden orders can be permanently deleted
  if (!order.isDeleted && !order.isHiddenByUser) {
    return next(
      new ErrorHandler(
        "Order must be in Trash or removed by user before permanent deletion",
        400
      )
    );
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order permanently deleted successfully",
  });
});


// ==========================================================
// EMPTY ADMIN TRASH
// DELETE /api/v1/admin/orders/trash/empty
// ==========================================================

export const emptyTrash = asyncHandler(async (req, res, next) => {
  const result = await Order.deleteMany({
    $or: [{ isDeleted: true }, { isHiddenByUser: true }],
  });

  res.status(200).json({
    success: true,
    message: `Trash emptied — ${result.deletedCount} order(s) permanently deleted`,
    deletedCount: result.deletedCount,
  });
});