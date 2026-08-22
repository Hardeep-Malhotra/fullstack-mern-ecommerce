import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Product from "../../models/productModel.js";

// @desc    Get all reviews of a single product
// @route   GET /api/v1/products/reviews?id=PRODUCT_ID
// @access  Public
export const getProductReviews = asyncHandler(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(
      new ErrorHandler(
        "Please provide product ID in query parameters (?id=...)",
        400,
      ),
    );
  }

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    count: product.reviews.length,
    reviews: product.reviews,
  });
});
