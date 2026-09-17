import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import Product from "../../models/productModel.js";

/**
 * @desc   Mark a review as helpful or unhelpful
 * @route  PUT /api/v1/products/:id/review/vote
 * @body   {
 *   reviewUserId: string,
 *   voteType: "helpful" | "unhelpful"
 * }
 * @access Private
 */
export const voteOnReview = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;
  const { reviewUserId, voteType } = req.body;

  const voterId = req.user._id.toString();

  // -----------------------------------
  // 1. Validate reviewUserId
  // -----------------------------------

  if (!reviewUserId) {
    return next(
      new ErrorHandler("reviewUserId is required", 400)
    );
  }

  // -----------------------------------
  // 2. Validate vote type
  // -----------------------------------

  if (!["helpful", "unhelpful"].includes(voteType)) {
    return next(
      new ErrorHandler(
        "voteType must be 'helpful' or 'unhelpful'",
        400
      )
    );
  }

  // -----------------------------------
  // 3. Find product
  // -----------------------------------

  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new ErrorHandler("Product not found", 404)
    );
  }

  // -----------------------------------
  // 4. Find review
  // -----------------------------------

  const review = product.reviews.find(
    (r) =>
      r.user.toString() === reviewUserId.toString()
  );

  if (!review) {
    return next(
      new ErrorHandler("Review not found", 404)
    );
  }

  // -----------------------------------
  // 5. Make sure vote arrays exist
  // -----------------------------------

  review.helpfulVotes = review.helpfulVotes || [];
  review.unhelpfulVotes = review.unhelpfulVotes || [];

  // -----------------------------------
  // 6. Check existing votes
  // -----------------------------------

  const inHelpful = review.helpfulVotes.some(
    (userId) =>
      userId.toString() === voterId
  );

  const inUnhelpful = review.unhelpfulVotes.some(
    (userId) =>
      userId.toString() === voterId
  );

  // -----------------------------------
  // 7. Remove user's old vote
  // -----------------------------------

  review.helpfulVotes =
    review.helpfulVotes.filter(
      (userId) =>
        userId.toString() !== voterId
    );

  review.unhelpfulVotes =
    review.unhelpfulVotes.filter(
      (userId) =>
        userId.toString() !== voterId
    );

  // -----------------------------------
  // 8. Toggle vote
  // -----------------------------------

  const alreadyVotedSameWay =
    (voteType === "helpful" && inHelpful) ||
    (voteType === "unhelpful" && inUnhelpful);

  // Same button clicked again
  // → remove vote
  if (!alreadyVotedSameWay) {
    if (voteType === "helpful") {
      review.helpfulVotes.push(req.user._id);
    } else {
      review.unhelpfulVotes.push(req.user._id);
    }
  }

  // -----------------------------------
  // 9. Save
  // -----------------------------------

  await product.save({
    validateBeforeSave: false,
  });

  // -----------------------------------
  // 10. Response
  // -----------------------------------

  res.status(200).json({
    success: true,
    helpfulCount: review.helpfulVotes.length,
    unhelpfulCount: review.unhelpfulVotes.length,
    userVote: alreadyVotedSameWay
      ? null
      : voteType,
  });
});