import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Product from "../../models/productModel.js";
import { deleteCache } from "../../utils/redisCache.js";

// @desc    Delete Product Review
// @route   DELETE /api/v1/products/:id/review
// @access  Private

export const deleteProductReview = asyncHandler(
  async (req, res, next) => {
    const { id: productId } = req.params;

    // =====================================
    // 1. Find Product
    // =====================================

    const product = await Product.findById(productId);

    if (!product) {
      return next(
        new ErrorHandler("Product not found", 404)
      );
    }

    const currentUserId = req.user._id.toString();

    // =====================================
    // CASE 1: NORMAL USER
    // =====================================

    if (req.user.role === "user") {
      const reviewExists = product.reviews.some(
        (review) =>
          review.user.toString() === currentUserId
      );

      if (!reviewExists) {
        return next(
          new ErrorHandler(
            "You can only delete your own review",
            403
          )
        );
      }

      product.reviews = product.reviews.filter(
        (review) =>
          review.user.toString() !== currentUserId
      );
    }

    // =====================================
    // CASE 2: SELLER
    // =====================================

    else if (req.user.role === "seller") {
      // Seller can delete reviews
      // only from their own products

      if (
        product.seller.toString() !== currentUserId
      ) {
        return next(
          new ErrorHandler(
            "You can only delete reviews from your own products",
            403
          )
        );
      }

      // IMPORTANT:
      // Frontend sends reviewer ID as:
      // /reviews/:userId

      const { userId } = req.params;

      if (!userId) {
        return next(
          new ErrorHandler(
            "Reviewer userId is required",
            400
          )
        );
      }

      const reviewExists = product.reviews.some(
        (review) =>
          review.user.toString() === userId.toString()
      );

      if (!reviewExists) {
        return next(
          new ErrorHandler(
            "Review not found",
            404
          )
        );
      }

      product.reviews = product.reviews.filter(
        (review) =>
          review.user.toString() !== userId.toString()
      );
    }

    // =====================================
    // CASE 3: ADMIN
    // =====================================

    else if (req.user.role === "admin") {
      return next(
        new ErrorHandler(
          "Admin is not allowed to delete product reviews",
          403
        )
      );
    }

    // =====================================
    // 2. Recalculate Review Count
    // =====================================

    product.numberOfReviews =
      product.reviews.length;

    // =====================================
    // 3. Recalculate Average Rating
    // =====================================

    product.ratings =
      product.reviews.length > 0
        ? product.reviews.reduce(
            (sum, review) =>
              sum + Number(review.rating || 0),
            0
          ) / product.reviews.length
        : 0;

    // =====================================
    // 4. Save Product
    // =====================================

    await product.save({
      validateBeforeSave: false,
    });

    // =====================================
    // 5. Clear AI Review Summary Cache
    // =====================================

    await deleteCache(
      `review_summary:${productId}`
    );

    // =====================================
    // 6. Response
    // =====================================

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      ratings: product.ratings,
      numberOfReviews: product.numberOfReviews,
    });
  }
);  