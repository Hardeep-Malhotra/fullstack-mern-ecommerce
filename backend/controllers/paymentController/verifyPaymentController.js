import crypto from "crypto";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";

// ==========================================================
// VERIFY RAZORPAY PAYMENT
// @route POST /api/v1/payment/verify
// @access Private
// ==========================================================

export const verifyRazorpayPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  // ------------------------------------------------------
  // 1. Validate Payload
  // ------------------------------------------------------
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new ErrorHandler("Incomplete Razorpay payment details", 400));
  }

  // ------------------------------------------------------
  // 2. Generate Expected Signature (HMAC SHA256)
  // ------------------------------------------------------
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  // ------------------------------------------------------
  // 3. Compare Signatures
  // ------------------------------------------------------
  if (generatedSignature !== razorpay_signature) {
    return next(
      new ErrorHandler("Payment verification failed. Invalid signature.", 400),
    );
  }

  // ------------------------------------------------------
  // 4. Return Verification Success
  // ------------------------------------------------------
  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    paymentInfo: {
      id: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "PAID",
    },
  });
});
