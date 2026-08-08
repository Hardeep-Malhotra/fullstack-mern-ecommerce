import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../middlewares/error.js";
import Product from "../../models/productModel.js";

// @desc    Create or Update Product Review
// @route   PUT /api/v1/review
// @access  Private (Logged-in Users)
export const createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // 1. Check karein ki user pehle se review de chuka hai ya nahi
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString(),
  );

  if (isReviewed) {
    // Purana review update karein
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    // Naya review array me push karein
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  // 2. Average Rating Recalculate karein
  const totalRating = product.reviews.reduce(
    (acc, item) => item.rating + acc,
    0,
  );
  product.ratings = totalRating / product.reviews.length;

  // 3. Database me save karein
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: isReviewed
      ? "Review updated successfully"
      : "Review added successfully",
    product,
  });
});
