// import asyncHandler from "../../middlewares/asyncHandler.js";
// import ErrorHandler from "../../utils/ErrorHandler.js";
// import Order from "../../models/orderModel.js";
// import Product from "../../models/productModel.js";

// export const createOrder = asyncHandler(async (req, res, next) => {
//   const {
//     shippingInfo,
//     orderItems,
//     paymentInfo,
//     taxPrice = 0,
//     shippingPrice = 0,
//   } = req.body;

//   // 1. Idempotency check :Prevent duplicate order for same payment
//   const existingOrder = await Order.findOne({
//     "paymentInfo.id": paymentInfo.id,
//   });

//   if (existingOrder) {
//     return next(
//       new ErrorHandler("An order with this Payment ID already exists", 400),
//     );
//   }

//   let calculatedItemsPrice = 0;
//   const verifiedOrderItems = [];

//   for (const item of orderItems) {
//     const dbProduct = await Product.findById(item.product);

//     if (!dbProduct) {
//       return next(new ErrorHandler(`Product not found : ${item.name}`, 404));
//     }

//     if (dbProduct.stock < item.quantity) {
//       return next(
//         new ErrorHandler(
//           `Insufficient stock for product: ${dbProduct.name}. Available: ${dbProduct.stock}`,
//           400,
//         ),
//       );
//     }

//     calculatedItemsPrice += dbProduct.price * item.quantity;

//     verifiedOrderItems.push({
//       name: dbProduct.name,
//       price: dbProduct.price, // DB price used, ignoring frontend payload price
//       quantity: item.quantity,
//       image: item.image,
//       product: dbProduct._id,
//     });
//   }

//   const calculatedTotalPrice = calculatedItemsPrice + taxPrice + shippingPrice;

//   // 3. Create Order Document
//   const order = await Order.create({
//     shippingInfo,
//     orderItems: verifiedOrderItems,
//     paymentInfo,
//     paidAt: Date.now(),
//     itemsPrice: calculatedItemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice: calculatedTotalPrice,
//     user: req.user.id,
//   });

//   // 4. Update Stock for Purchased Items
//   for (const item of orderItems) {
//     await Product.findByIdAndUpdate(item.product, {
//       $inc: { stock: -item.quantity },
//     });
//   }

//   res.status(201).json({
//     success: true,
//     message: "Order placed successfully",
//     order,
//   });
// });




import mongoose from "mongoose";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";

// Create Order with MongoDB ACID Transaction -> POST /api/v1/order/new
export const createOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxPrice = 0,
    shippingPrice = 0,
  } = req.body;

  // 1. Start MongoDB Session & Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Idempotency Check (Session bound)
    const existingOrder = await Order.findOne({
      "paymentInfo.id": paymentInfo.id,
    }).session(session);

    if (existingOrder) {
      throw new ErrorHandler("An order with this Payment ID already exists", 400);
    }

    let calculatedItemsPrice = 0;
    const verifiedOrderItems = [];

    // 3. Stock Check & Price Calculation (DB-Side Verification)
    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product).session(session);

      if (!dbProduct) {
        throw new ErrorHandler(`Product not found: ${item.name}`, 404);
      }

      if (dbProduct.stock < item.quantity) {
        throw new ErrorHandler(
          `Insufficient stock for product: ${dbProduct.name}. Available: ${dbProduct.stock}`,
          400
        );
      }

      calculatedItemsPrice += dbProduct.price * item.quantity;

      verifiedOrderItems.push({
        name: dbProduct.name,
        price: dbProduct.price, // Trust DB price only
        quantity: item.quantity,
        image: item.image,
        product: dbProduct._id,
      });
    }

    const calculatedTotalPrice = calculatedItemsPrice + taxPrice + shippingPrice;

    // 4. Create Order Document (Note: Mongoose transaction requires array syntax for .create)
    const orders = await Order.create(
      [
        {
          shippingInfo,
          orderItems: verifiedOrderItems,
          paymentInfo,
          paidAt: Date.now(),
          itemsPrice: calculatedItemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice: calculatedTotalPrice,
          user: req.user._id,
        },
      ],
      { session }
    );

    const createdOrder = orders[0];

    // 5. Deduct Stock Atomically with Race Condition Guard
    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } }, // Stock check guard
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );

      // Edge-case: If concurrent request grabbed stock during transaction window
      if (!updatedProduct) {
        throw new ErrorHandler(
          `Stock changed during checkout for product: ${item.name}. Please try again.`,
          400
        );
      }
    }

    // 6. Commit Transaction (Permanently apply all DB writes)
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    // 7. Rollback Transaction on ANY Failure
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
});