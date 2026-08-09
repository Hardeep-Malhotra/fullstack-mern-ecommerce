import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxPrice = 0,
    shippingPrice = 0,
  } = req.body;

  // 1. Idempotency check :Prevent duplicate order for same payment
  const existingOrder = await Order.findOne({
    "paymentInfo.id": paymentInfo.id,
  });

  if (existingOrder) {
    return next(
      new ErrorHandler("An order with this Payment ID already exists", 400),
    );
  }

  let calculatedItemsPrice = 0;
  const verifiedOrderItems = [];

  for (const item of orderItems) {
    const dbProduct = await Product.findById(item.product);

    if (!dbProduct) {
      return next(new ErrorHandler(`Product not found : ${item.name}`, 404));
    }

    if (dbProduct.stock < item.quantity) {
      return next(
        new ErrorHandler(
          `Insufficient stock for product: ${dbProduct.name}. Available: ${dbProduct.stock}`,
          400,
        ),
      );
    }

    calculatedItemsPrice += dbProduct.price * item.quantity;

    verifiedOrderItems.push({
      name: dbProduct.name,
      price: dbProduct.price, // DB price used, ignoring frontend payload price
      quantity: item.quantity,
      image: item.image,
      product: dbProduct._id,
    });
  }

  const calculatedTotalPrice = calculatedItemsPrice + taxPrice + shippingPrice;

  // 3. Create Order Document
  const order = await Order.create({
    shippingInfo,
    orderItems: verifiedOrderItems,
    paymentInfo,
    paidAt: Date.now(),
    itemsPrice: calculatedItemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice: calculatedTotalPrice,
    user: req.user.id,
  });

  // 4. Update Stock for Purchased Items
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});
