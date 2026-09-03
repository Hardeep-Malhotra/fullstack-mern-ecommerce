import Product from "../../models/productModel.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { getCache, setCache } from "../../utils/redisCache.js";

// @desc    Get single product details
// @route   GET /api/v1/product/:id
export const getSingleProduct = asyncHandler(async (req, res, next) => {
  // =====================================================
  // 1. CREATE REDIS CACHE KEY
  // =====================================================

  const cacheKey = `product:details:${req.params.id}`;

  // =====================================================
  // 2. CHECK REDIS CACHE
  // =====================================================

  const cachedProduct = await getCache(cacheKey);

  if (cachedProduct) {
    console.log("⚡ PRODUCT SERVED FROM REDIS");

    return res.status(200).json({
      success: true,
      product: cachedProduct,
      fromCache: true,
    });
  }

  // =====================================================
  // 3. REDIS MISS → GET PRODUCT FROM MONGODB
  // =====================================================

  console.log("🟡 PRODUCT CACHE MISS → FETCHING FROM MONGODB");

  const product = await Product.findById(req.params.id);

  // =====================================================
  // 4. CHECK PRODUCT EXISTS
  // =====================================================

  if (!product) {
    return next(new ErrorHandler("Product not found with this ID", 404));
  }

  // =====================================================
  // 5. SAVE PRODUCT IN REDIS
  // TTL = 30 MINUTES
  // =====================================================

  await setCache(cacheKey, product, 1800);

  console.log("🟢 PRODUCT SAVED TO REDIS FOR 30 MINUTES");

  // =====================================================
  // 6. SEND RESPONSE
  // =====================================================

  res.status(200).json({
    success: true,
    product,
    fromCache: false,
  });
});
