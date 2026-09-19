import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Product from "../../models/productModel.js";
import axios from "axios";
import { getCache, setCache } from "../../utils/redisCache.js";

const CACHE_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const MIN_REVIEWS_FOR_SUMMARY = 3;

/**
 * @desc   Get (or generate) an AI summary of a product's reviews
 * @route  GET /api/v1/products/:id/review-summary
 * @access Public
 *
 * Flow:
 * Redis HIT  -> return cached summary immediately
 * Redis MISS -> Mongo reviews -> Python AI -> Redis -> response
 */
export const getProductReviewSummary = asyncHandler(
  async (req, res, next) => {

    const { id: productId } = req.params;

    const cacheKey = `review_summary:${productId}`;

    // ==========================================
    // 1. CACHE CHECK
    // ==========================================

    const cached = await getCache(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        summary: cached,
        cached: true,
      });
    }

    // ==========================================
    // 2. FETCH REVIEWS FROM MONGO
    // ==========================================

    const product = await Product.findById(productId)
      .select("reviews name");

    if (!product) {
      return next(
        new ErrorHandler("Product not found", 404)
      );
    }

    // Minimum 3 reviews required
    if (product.reviews.length < MIN_REVIEWS_FOR_SUMMARY) {
      return res.status(200).json({
        success: true,
        summary: null,
        message: "Not enough reviews yet for an AI summary",
        cached: false,
      });
    }

    // Latest 100 reviews
    const reviewsPayload = product.reviews
      .slice(-100)
      .map((r) => ({
        rating: r.rating,
        comment: r.comment,
        isVerifiedPurchase: r.isVerifiedPurchase,
      }));

    // ==========================================
    // 3. CALL PYTHON AI SERVICE
    // ==========================================

    let summary;

    try {

      const { data } = await axios.post(
        `${process.env.AI_SERVICE_URL}/ai/review-summary`,
        {
          reviews: reviewsPayload,
        },
        {
          timeout: 25000,
        }
      );

      summary = data.summary;

    } catch (err) {

      console.error(
        "AI review-summary service call failed:",
        err.message
      );

      return next(
        new ErrorHandler(
          "Failed to generate review summary",
          502
        )
      );
    }

    // ==========================================
    // 4. SAVE SUMMARY IN REDIS
    // ==========================================

    await setCache(
      cacheKey,
      summary,
      CACHE_TTL_SECONDS
    );

    // ==========================================
    // 5. SEND RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      summary,
      cached: false,
    });
  }
);