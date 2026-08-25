import razorpay from "../../config/razorpay.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { createCircuitBreaker } from "../../utils/circuitBreaker.js";

// 1. Core API Logic Function
const callRazorpayOrderAPI = async (options) => {
  return await razorpay.orders.create(options);
};

// 2. Wrap Function with Circuit Breaker
export const razorpayOrderBreaker = createCircuitBreaker(callRazorpayOrderAPI);

// ==========================================================
// CREATE RAZORPAY ORDER
// ==========================================================
export const createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || Number(amount) <= 0) {
    return next(new ErrorHandler("Valid payment amount is required", 400));
  }

  const options = {
    amount: Math.round(Number(amount) * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      userId: req.user?._id?.toString() || "",
    },
  };

  // 3. razorpay.orders.create ki jagah breaker.fire() se call karen
  const order = await razorpayOrderBreaker.fire(options);

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
