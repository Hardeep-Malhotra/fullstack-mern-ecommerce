import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js"
import Product from "../../models/productModel.js";

// @desc    Delete Product Review
// @route   DELETE /api/v1/products/reviews?productId=PRODUCT_ID&id=USER_ID
// @access  Private (Logged-in User / Admin)
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { productId, id } = req.query; // 'id' yahan review dene wale user ki ID hai

  if (!productId || !id) {
    return next(
      new ErrorHandler(
        "Please provide both productId and id (user ID) in query parameters",
        400,
      ),
    );
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // 1. Review array se specified user ka review remove karein
  const reviews = product.reviews.filter(
    (rev) => rev.user.toString() !== id.toString(),
  );

  // 2. Average Rating & Review Count Recalculate karein
  const numberOfReviews = reviews.length;
  let ratings = 0;

  if (numberOfReviews > 0) {
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    ratings = totalRating / numberOfReviews;
  }

  // 3. Updated product fields save karein
  product.reviews = reviews;
  product.ratings = ratings;
  product.numberOfReviews = numberOfReviews;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    product,
  });
});
