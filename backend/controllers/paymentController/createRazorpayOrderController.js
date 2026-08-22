import razorpay from "../../config/razorpay.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// ==========================================================
// CREATE RAZORPAY ORDER
// @route POST /api/v1/payment/create-order
// @access Private
// ==========================================================

export const createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;

  // ------------------------------------------------------
  // 1. Validate amount
  // ------------------------------------------------------
  if (!amount || Number(amount) <= 0) {
    return next(new ErrorHandler("Valid payment amount is required", 400));
  }

  // ------------------------------------------------------
  // 2. Razorpay amount format (ALWAYS in smallest currency unit)
  // INR → Paise (₹100 = 10000 paise)
  // ------------------------------------------------------
  const options = {
    amount: Math.round(Number(amount) * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      userId: req.user?._id?.toString() || "",
    },
  };

  // ------------------------------------------------------
  // 3. Create Razorpay Order
  // ------------------------------------------------------
  const order = await razorpay.orders.create(options);

  // ------------------------------------------------------
  // 4. Send response to frontend
  // ------------------------------------------------------
  res.status(200).json({
    success: true,
    order: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    },
    key: process.env.RAZORPAY_KEY_ID,
  });
});
