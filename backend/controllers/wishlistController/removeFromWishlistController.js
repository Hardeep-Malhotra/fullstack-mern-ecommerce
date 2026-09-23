import asyncHandler from "../../middlewares/asyncHandler.js";
import User from "../../models/userModel.js";

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        wishlist: productId,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
  });
});