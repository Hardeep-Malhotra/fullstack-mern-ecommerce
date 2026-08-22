import express from "express";

// Controllers
import { createRazorpayOrder } from "../controllers/paymentController/createRazorpayOrderController.js";
import { verifyRazorpayPayment } from "../controllers/paymentController/verifyPaymentController.js";

// Middlewares
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

// ==========================================================
// PAYMENT ROUTES
// Base Path: /api/v1/payment
// ==========================================================

// Create Razorpay Order -> POST /api/v1/payment/create-order
router.post("/create-order", isAuthenticatedUser, createRazorpayOrder);

// Verify Razorpay Payment Signature -> POST /api/v1/payment/verify
router.post("/verify", isAuthenticatedUser, verifyRazorpayPayment);

export default router;
