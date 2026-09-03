import Product from "../../models/productModel.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import {
  deleteCache,
  deleteCacheByPattern,
} from "../../utils/redisCache.js";

export const deleteProduct = asyncHandler(async (req, res, next) => {

  // =====================================================
  // 1. DELETE PRODUCT FROM MONGODB
  // =====================================================

  const product = await Product.findByIdAndDelete(req.params.id);

  // =====================================================
  // 2. CHECK PRODUCT EXISTS
  // =====================================================

  if (!product) {
    return next(
      new ErrorHandler("Product not found with this ID", 404)
    );
  }

  // =====================================================
  // 3. CLEAR SINGLE PRODUCT CACHE
  // =====================================================

  await deleteCache(
    `product:details:${req.params.id}`
  );

  // =====================================================
  // 4. CLEAR ALL PRODUCT LIST CACHE
  // =====================================================

  await deleteCacheByPattern("products:*");

  // =====================================================
  // 5. RESPONSE
  // =====================================================

  res.status(200).json({
    success: true,
    message: "Product Successfully Deleted",
    product,
  });
});