// // import mongoose from "mongoose";
// // import asyncHandler from "../../middlewares/asyncHandler.js";
// // import ErrorHandler from "../../utils/errorHandler.js";
// // import Order from "../../models/orderModel.js";
// // import Product from "../../models/productModel.js";

// // // Create Order with MongoDB ACID Transaction -> POST /api/v1/order/new
// // export const createOrder = asyncHandler(async (req, res, next) => {
// //   const {
// //     shippingInfo,
// //     orderItems,
// //     paymentInfo,
// //     taxPrice = 0,
// //     shippingPrice = 0,
// //   } = req.body;

// //   // 1. Start MongoDB Session & Transaction
// //   const session = await mongoose.startSession();
// //   session.startTransaction();

// //   try {
// //     // 2. Idempotency Check (Session bound)
// //     const existingOrder = await Order.findOne({
// //       "paymentInfo.id": paymentInfo.id,
// //     }).session(session);

// //     if (existingOrder) {
// //       throw new ErrorHandler(
// //         "An order with this Payment ID already exists",
// //         400,
// //       );
// //     }

// //     let calculatedItemsPrice = 0;
// //     const verifiedOrderItems = [];

// //     // 3. Stock Check & Price Calculation (DB-Side Verification)
// //     for (const item of orderItems) {
// //       const dbProduct = await Product.findById(item.product).session(session);

// //       if (!dbProduct) {
// //         throw new ErrorHandler(`Product not found: ${item.name}`, 404);
// //       }

// //       if (dbProduct.stock < item.quantity) {
// //         throw new ErrorHandler(
// //           `Insufficient stock for product: ${dbProduct.name}. Available: ${dbProduct.stock}`,
// //           400,
// //         );
// //       }

// //       calculatedItemsPrice += dbProduct.price * item.quantity;

// //       verifiedOrderItems.push({
// //         name: dbProduct.name,
// //         price: dbProduct.price, // Trust DB price only
// //         quantity: item.quantity,
// //         image: item.image,
// //         product: dbProduct._id,
// //       });
// //     }

// //     const calculatedTotalPrice =
// //       calculatedItemsPrice + taxPrice + shippingPrice;

// //     // 4. Create Order Document
// //     const orders = await Order.create(
// //       [
// //         {
// //           shippingInfo: {
// //             address: shippingInfo.address,
// //             city: shippingInfo.city,
// //             state: shippingInfo.state,
// //             country: shippingInfo.country || "India",
// //             pinCode: shippingInfo.pinCode || shippingInfo.postalCode,
// //             phoneNo: shippingInfo.phoneNo || shippingInfo.phone,
// //           },
// //           orderItems: verifiedOrderItems,
// //           paymentInfo,
// //           paidAt: Date.now(),
// //           itemsPrice: calculatedItemsPrice,
// //           taxPrice,
// //           shippingPrice,
// //           totalPrice: calculatedTotalPrice,
// //           user: req.user._id,
// //           // FIX: Schema validation satisfy karne ke liye statusHistory initial value daal di
// //           statusHistory: [
// //             {
// //               status: "Processing",
// //               comment: "Order created successfully",
// //               updatedBy: req.user._id,
// //             },
// //           ],
// //         },
// //       ],
// //       { session },
// //     );

// //     const createdOrder = orders[0];

// //     // 5. Deduct Stock Atomically with Race Condition Guard
// //     for (const item of orderItems) {
// //       const updatedProduct = await Product.findOneAndUpdate(
// //         { _id: item.product, stock: { $gte: item.quantity } },
// //         { $inc: { stock: -item.quantity } },
// //         { new: true, session },
// //       );

// //       if (!updatedProduct) {
// //         throw new ErrorHandler(
// //           `Stock changed during checkout for product: ${item.name}. Please try again.`,
// //           400,
// //         );
// //       }
// //     }

// //     // 6. Commit Transaction
// //     await session.commitTransaction();
// //     session.endSession();

// //     res.status(201).json({
// //       success: true,
// //       message: "Order placed successfully",
// //       order: createdOrder,
// //     });
// //   } catch (error) {
// //     // 7. Rollback Transaction on ANY Failure
// //     await session.abortTransaction();
// //     session.endSession();
// //     return next(error);
// //   }
// // });

// import mongoose from "mongoose";
// import asyncHandler from "../../middlewares/asyncHandler.js";
// import ErrorHandler from "../../utils/errorHandler.js";
// import Order from "../../models/orderModel.js";
// import Product from "../../models/productModel.js";

// // Create Order with MongoDB ACID Transaction -> POST /api/v1/order/new
// export const createOrder = asyncHandler(async (req, res, next) => {
//   const {
//     shippingInfo,
//     orderItems,
//     paymentInfo,
//     taxPrice = 0,
//     shippingPrice = 0,
//   } = req.body;

//   // 1. Start MongoDB Session & Transaction
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // 2. Idempotency Check (Session bound)
//     const existingOrder = await Order.findOne({
//       "paymentInfo.id": paymentInfo.id,
//     }).session(session);

//     if (existingOrder) {
//       throw new ErrorHandler(
//         "An order with this Payment ID already exists",
//         400,
//       );
//     }

//     let calculatedItemsPrice = 0;
//     const verifiedOrderItems = [];

//     // 3. Stock Check & Price Calculation (DB-Side Verification + Seller Extraction)
//     for (const item of orderItems) {
//       const dbProduct = await Product.findById(item.product).session(session);

//       if (!dbProduct) {
//         throw new ErrorHandler(`Product not found: ${item.name}`, 404);
//       }

//       if (dbProduct.stock < item.quantity) {
//         throw new ErrorHandler(
//           `Insufficient stock for product: ${dbProduct.name}. Available: ${dbProduct.stock}`,
//           400,
//         );
//       }

//       calculatedItemsPrice += dbProduct.price * item.quantity;

//       verifiedOrderItems.push({
//         name: dbProduct.name,
//         price: dbProduct.price, // Trust DB price only
//         quantity: item.quantity,
//         image: item.image,
//         product: dbProduct._id,
//         seller: dbProduct.seller || dbProduct.user, // 👈 Multi-Vendor Fix: Product Schema se Seller ID extract karke link kar di
//       });
//     }

//     const calculatedTotalPrice =
//       calculatedItemsPrice + taxPrice + shippingPrice;

//     // 4. Create Order Document
//     const orders = await Order.create(
//       [
//         {
//           shippingInfo: {
//             address: shippingInfo.address,
//             city: shippingInfo.city,
//             state: shippingInfo.state,
//             country: shippingInfo.country || "India",
//             pinCode: shippingInfo.pinCode || shippingInfo.postalCode,
//             phoneNo: shippingInfo.phoneNo || shippingInfo.phone,
//           },
//           orderItems: verifiedOrderItems,
//           paymentInfo,
//           paidAt: Date.now(),
//           itemsPrice: calculatedItemsPrice,
//           taxPrice,
//           shippingPrice,
//           totalPrice: calculatedTotalPrice,
//           user: req.user._id,
//           statusHistory: [
//             {
//               status: "Processing",
//               comment: "Order created successfully",
//               updatedBy: req.user._id,
//             },
//           ],
//         },
//       ],
//       { session },
//     );

//     const createdOrder = orders[0];

//     // 5. Deduct Stock Atomically with Race Condition Guard
//     for (const item of orderItems) {
//       const updatedProduct = await Product.findOneAndUpdate(
//         { _id: item.product, stock: { $gte: item.quantity } },
//         { $inc: { stock: -item.quantity } },
//         { new: true, session },
//       );

//       if (!updatedProduct) {
//         throw new ErrorHandler(
//           `Stock changed during checkout for product: ${item.name}. Please try again.`,
//           400,
//         );
//       }
//     }

//     // 6. Commit Transaction
//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order: createdOrder,
//     });
//   } catch (error) {
//     // 7. Rollback Transaction on ANY Failure
//     await session.abortTransaction();
//     session.endSession();
//     return next(error);
//   }
// });


import mongoose from "mongoose";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import { deleteCache } from "../../utils/redisCache.js"; // ⚡ Redis Cache Invalidation Import

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
      throw new ErrorHandler(
        "An order with this Payment ID already exists",
        400,
      );
    }

    let calculatedItemsPrice = 0;
    const verifiedOrderItems = [];

    // 3. Stock Check & Price Calculation (DB-Side Verification + Seller Extraction)
    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product).session(session);

      if (!dbProduct) {
        throw new ErrorHandler(`Product not found: ${item.name}`, 404);
      }

      if (dbProduct.stock < item.quantity) {
        throw new ErrorHandler(
          `Insufficient stock for product: ${dbProduct.name}. Available: ${dbProduct.stock}`,
          400,
        );
      }

      calculatedItemsPrice += dbProduct.price * item.quantity;

      verifiedOrderItems.push({
        name: dbProduct.name,
        price: dbProduct.price, // Trust DB price only
        quantity: item.quantity,
        image: item.image,
        product: dbProduct._id,
        seller: dbProduct.seller || dbProduct.user, // Multi-Vendor Seller Extraction
      });
    }

    const calculatedTotalPrice =
      calculatedItemsPrice + taxPrice + shippingPrice;

    // 4. Create Order Document
    const orders = await Order.create(
      [
        {
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country || "India",
            pinCode: shippingInfo.pinCode || shippingInfo.postalCode,
            phoneNo: shippingInfo.phoneNo || shippingInfo.phone,
          },
          orderItems: verifiedOrderItems,
          paymentInfo,
          paidAt: Date.now(),
          itemsPrice: calculatedItemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice: calculatedTotalPrice,
          user: req.user._id,
          statusHistory: [
            {
              status: "Processing",
              comment: "Order created successfully",
              updatedBy: req.user._id,
            },
          ],
        },
      ],
      { session },
    );

    const createdOrder = orders[0];

    // 5. Deduct Stock Atomically with Race Condition Guard
    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true, session },
      );

      if (!updatedProduct) {
        throw new ErrorHandler(
          `Stock changed during checkout for product: ${item.name}. Please try again.`,
          400,
        );
      }
    }

    // 6. Commit Transaction
    await session.commitTransaction();
    session.endSession();

   // =====================================================
    // ⚡ REDIS CACHE INVALIDATION (Post-Commit Execution)
    // =====================================================
    try {
      // Clear Admin Dashboard Cache
      await deleteCache("admin:dashboard:stats");

      // Extract Unique Sellers & Clear Seller Caches
      const sellerIds = [
        ...new Set(
          verifiedOrderItems
            .map((item) => item.seller?.toString())
            .filter(Boolean)
        ),
      ];

      for (const sellerId of sellerIds) {
        await deleteCache(`seller:stats:${sellerId}`);
      }

      console.log("⚡ INVALIDATION FLOW EXECUTED FOR NEW ORDER");
    } catch (cacheErr) {
      console.error("⚠️ Redis Cache Invalidation Error:", cacheErr);
    }
    // Send Response
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