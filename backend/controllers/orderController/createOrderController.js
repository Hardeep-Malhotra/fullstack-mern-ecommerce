import mongoose from "mongoose";

import asyncHandler from "../../middlewares/asyncHandler.js";

import ErrorHandler from "../../utils/errorHandler.js";

import Order from "../../models/orderModel.js";

import Product from "../../models/productModel.js";

import User from "../../models/userModel.js";

import { deleteCache } from "../../utils/redisCache.js";

import { sendEmail } from "../../utils/sendEmail.js";

import { orderPlacedEmailTemplate } from "../../utils/emailTemplates.js";

// =====================================================
// CREATE ORDER WITH MONGODB ACID TRANSACTION
// POST /api/v1/order/new
// =====================================================

export const createOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxPrice = 0,
    shippingPrice = 0,
  } = req.body;

  // =====================================================
  // 1. START MONGODB SESSION & TRANSACTION
  // =====================================================

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    // =====================================================
    // 2. IDEMPOTENCY CHECK
    // =====================================================

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

    // =====================================================
    // 3. VERIFY PRODUCTS + STOCK + PRICE
    // =====================================================

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

      // Calculate price using database price only

      calculatedItemsPrice += dbProduct.price * item.quantity;

      verifiedOrderItems.push({
        name: dbProduct.name,

        price: dbProduct.price,

        quantity: item.quantity,

        image: item.image,

        product: dbProduct._id,

        seller: dbProduct.seller || dbProduct.user,
      });
    }

    // =====================================================
    // 4. CALCULATE TOTAL PRICE
    // =====================================================

    const calculatedTotalPrice =
      calculatedItemsPrice + taxPrice + shippingPrice;

    // =====================================================
    // 5. CREATE ORDER
    // =====================================================

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

      {
        session,
      },
    );

    const createdOrder = orders[0];

    // =====================================================
    // 6. DEDUCT STOCK ATOMICALLY
    // =====================================================

    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,

          stock: {
            $gte: item.quantity,
          },
        },

        {
          $inc: {
            stock: -item.quantity,
          },
        },

        {
          new: true,

          session,
        },
      );

      if (!updatedProduct) {
        throw new ErrorHandler(
          `Stock changed during checkout for product: ${item.name}. Please try again.`,

          400,
        );
      }
    }

    // =====================================================
    // 7. COMMIT TRANSACTION
    // =====================================================

    await session.commitTransaction();

    session.endSession();

    // =====================================================
    // ⚡ REDIS CACHE INVALIDATION
    // POST-COMMIT EXECUTION
    // =====================================================

    try {
      // Clear Admin Dashboard Cache

      await deleteCache("admin:dashboard:stats");

      // Extract Unique Sellers

      const sellerIds = [
        ...new Set(
          verifiedOrderItems

            .map((item) => item.seller?.toString())

            .filter(Boolean),
        ),
      ];

      // Clear Seller Caches

      for (const sellerId of sellerIds) {
        await deleteCache(`seller:stats:${sellerId}`);
      }

      console.log("⚡ INVALIDATION FLOW EXECUTED FOR NEW ORDER");
    } catch (cacheErr) {
      console.error(
        "⚠️ Redis Cache Invalidation Error:",

        cacheErr,
      );
    }

    // =====================================================
    // 📧 SEND ORDER CONFIRMATION EMAIL
    // =====================================================

    try {
      const user = await User.findById(req.user._id);

      if (user) {
        await sendEmail({
          email: user.email,

          subject: `Order Confirmed - ${createdOrder._id}`,

          html: orderPlacedEmailTemplate(user.name, createdOrder),

          message: `Your order ${createdOrder._id} has been placed successfully.`,
        });

        console.log(`📧 Order confirmation email sent to ${user.email}`);
      }
    } catch (emailError) {
      // IMPORTANT:
      // Email fail hone par order rollback nahi hoga,
      // because order already successfully commit ho chuka hai.

      console.error(
        "❌ Order Email Sending Failed:",

        emailError.message,
      );
    }

    // =====================================================
    // 8. SEND RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,

      message: "Order placed successfully",

      order: createdOrder,
    });
  } catch (error) {
    // =====================================================
    // 9. ROLLBACK TRANSACTION
    // =====================================================

    await session.abortTransaction();

    session.endSession();

    return next(error);
  }
});
