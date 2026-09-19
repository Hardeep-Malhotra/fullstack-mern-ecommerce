import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import Product from "../../models/productModel.js";
import Order from "../../models/orderModel.js";
import { deleteCache } from "../../utils/redisCache.js";

/**
 * @desc   Create a new review OR update user's existing review on a product
 * @route  PUT /api/v1/products/:id/review
 * @access Private
 *
 * Rules:
 * - User must have purchased the product
 * - Processing/Shipped order -> review allowed but not verified
 * - Delivered order -> verified purchase
 * - User who never purchased -> cannot review
 */
export const createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const { id: productId } = req.params;

  // ---------------------------------------
  // 1. Validate request body
  // ---------------------------------------

  if (rating === undefined || !comment) {
    return next(new ErrorHandler("Rating and comment are required", 400));
  }

  const numericRating = Number(rating);

  if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return next(
      new ErrorHandler("Rating must be a number between 1 and 5", 400),
    );
  }

  if (comment.trim().length < 5) {
    return next(new ErrorHandler("Comment must be at least 5 characters", 400));
  }

  // ---------------------------------------
  // 2. Find product
  // ---------------------------------------

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // ---------------------------------------
  // 3. Check whether user purchased product
  // ---------------------------------------

  const purchasedOrder = await Order.exists({
    user: req.user._id,
    orderStatus: {
      $in: ["Processing", "Shipped", "Delivered"],
    },
    "orderItems.product": productId,
  });

  // User never purchased this product
  if (!purchasedOrder) {
    return next(
      new ErrorHandler("You can review only products you have purchased", 403),
    );
  }

  // ---------------------------------------
  // 4. Check delivery status
  // ---------------------------------------

  const deliveredOrder = await Order.exists({
    user: req.user._id,
    orderStatus: "Delivered",
    "orderItems.product": productId,
  });

  const isVerifiedPurchase = Boolean(deliveredOrder);

  // ---------------------------------------
  // 5. Prepare review
  // ---------------------------------------

  const newReview = {
    user: req.user._id,
    name: req.user.name,
    rating: numericRating,
    comment: comment.trim(),
    isVerifiedPurchase,
    createdAt: new Date(),
    helpfulVotes: [],
    unhelpfulVotes: [],
  };

  // ---------------------------------------
  // 6. Check existing review
  // ---------------------------------------

  const existingIndex = product.reviews.findIndex(
    (review) => review.user.toString() === req.user._id.toString(),
  );

  const isUpdate = existingIndex !== -1;

  // ---------------------------------------
  // 7. Update existing review
  // ---------------------------------------

  if (isUpdate) {
    const existingReview = product.reviews[existingIndex];

    // Keep original review date
    newReview.createdAt = existingReview.createdAt;

    // Keep existing votes
    newReview.helpfulVotes = existingReview.helpfulVotes || [];
    newReview.unhelpfulVotes = existingReview.unhelpfulVotes || [];

    product.reviews[existingIndex] = newReview;
  }

  // ---------------------------------------
  // 8. Add new review
  // ---------------------------------------
  else {
    product.reviews.push(newReview);
  }

  // ---------------------------------------
  // 9. Recalculate review count
  // ---------------------------------------

  product.numberOfReviews = product.reviews.length;

  // ---------------------------------------
  // 10. Recalculate average rating
  // ---------------------------------------

  product.ratings =
    product.reviews.reduce((sum, review) => sum + review.rating, 0) /
    product.reviews.length;

  // ---------------------------------------
  // 11. Save product
  // ---------------------------------------

  await product.save({
    validateBeforeSave: false,
  });

  // ---------------------------------------
  // 12. Invalidate AI review summary cache
  // ---------------------------------------

  await deleteCache(`review_summary:${productId}`);

  // ---------------------------------------
  // 13. Response
  // ---------------------------------------

  res.status(isUpdate ? 200 : 201).json({
    success: true,
    message: isUpdate
      ? "Review updated successfully"
      : "Review added successfully",
    ratings: product.ratings,
    numberOfReviews: product.numberOfReviews,
    isVerifiedPurchase: newReview.isVerifiedPurchase,
  });
});
