
import Product from "../../models/productModel.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import {
  deleteCache,
  deleteCacheByPattern,
} from "../../utils/redisCache.js";

// @desc    Update single product details
// @route   PUT /api/v1/products/:id
export const updateProduct = asyncHandler(async (req, res, next) => {

  // =====================================================
  // 1. CHECK PRODUCT EXISTS
  // =====================================================

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorHandler("Product not found with this ID", 404)
    );
  }

  // =====================================================
  // 2. LIMIT PRODUCT NAME
  // =====================================================

  if (req.body.name && req.body.name.length > 100) {
    req.body.name = req.body.name.substring(0, 100);
  }

  // =====================================================
  // 3. UPDATE PRODUCT IN MONGODB
  // =====================================================

  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  // =====================================================
  // 4. CLEAR SINGLE PRODUCT CACHE
  // =====================================================

  await deleteCache(
    `product:details:${req.params.id}`
  );

  // =====================================================
  // 5. CLEAR ALL PRODUCT LIST CACHE
  // =====================================================

  await deleteCacheByPattern("products:*");

  // =====================================================
  // 6. RESPONSE
  // =====================================================

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    product,
  });
});