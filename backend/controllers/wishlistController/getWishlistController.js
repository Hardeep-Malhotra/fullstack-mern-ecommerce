import asyncHandler from "../../middlewares/asyncHandler.js";
import User from "../../models/userModel.js";
import ErrorHandler from "../../utils/errorHandler.js";
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "wishlist",
    select: "name price images category stock ratings numOfReviews seller",
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    wishlist: user.wishlist,
  });
});
