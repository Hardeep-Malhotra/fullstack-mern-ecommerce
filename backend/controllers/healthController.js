import asyncHandler from "../middlewares/asyncHandler.js";
import { razorpayOrderBreaker } from "../controllers/paymentController/createRazorpayOrderController.js"; 

// ==========================================================
// GET SYSTEM & SERVICES HEALTH
// @route   GET /api/v1/admin/system-health
// @access  Private/Admin
// ==========================================================
export const getSystemHealth = asyncHandler(async (req, res, next) => {

  const isRazorpayOpen = razorpayOrderBreaker.opened;
  const isRazorpayHalfOpen = razorpayOrderBreaker.halfOpen;

  let razorpayStatus = "HEALTHY";
  if (isRazorpayOpen) razorpayStatus = "DOWN (Circuit Open)";
  if (isRazorpayHalfOpen) razorpayStatus = "RECOVERING (Half-Open)";

  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    services: {
      razorpayGateway: {
        status: razorpayStatus,
        isCircuitOpen: isRazorpayOpen,
        stats: {
          totalFires: razorpayOrderBreaker.stats.fires,
          successful: razorpayOrderBreaker.stats.successes,
          failed: razorpayOrderBreaker.stats.failures,
          timeouts: razorpayOrderBreaker.stats.timeouts,
          rejects: razorpayOrderBreaker.stats.rejects,
        },
      },

      database: {
        status: "CONNECTED",
      },
    },
  });
});
