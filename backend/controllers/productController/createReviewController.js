import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Product from "../../models/productModel.js";

// @desc    Create or Update Product Review
// @route   PUT /api/v1/products/:id/review
// @access  Private (Users Only)

export const createProductReview = asyncHandler(
  async (req, res, next) => {

    // Only normal users can create/update reviews
    if (req.user.role !== "user") {
      return next(
        new ErrorHandler(
          "Only users are allowed to create product reviews",
          403
        )
      );
    }

    const { rating, comment } = req.body;
    const { id: productId } = req.params;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
      return next(
        new ErrorHandler("Product not found", 404)
      );
    }

    // Check whether user already reviewed
    const isReviewed = product.reviews.find(
      (rev) =>
        rev.user.toString() ===
        req.user._id.toString()
    );

    if (isReviewed) {

      // Update existing review
      product.reviews.forEach((rev) => {
        if (
          rev.user.toString() ===
          req.user._id.toString()
        ) {
          rev.rating = Number(rating);
          rev.comment = comment;
        }
      });

    } else {

      // Add new review
      product.reviews.push(review);

      product.numberOfReviews =
        product.reviews.length;
    }

    // Calculate total rating
    const totalRating = product.reviews.reduce(
      (acc, item) =>
        item.rating + acc,
      0
    );

    // Calculate average rating
    product.ratings =
      totalRating / product.reviews.length;

    // Save product
    await product.save();

    return res.status(
      isReviewed ? 200 : 201
    ).json({
      success: true,

      message: isReviewed
        ? "Review updated successfully"
        : "Review added successfully",

      ratings: product.ratings,

      numberOfReviews:
        product.numberOfReviews,
    });
  }
);