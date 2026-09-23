import asyncHandler from "../../middlewares/asyncHandler.js";
import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import ErrorHandler from "../../utils/errorHandler.js";
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Check product exists
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Add product only if not already present
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        wishlist: productId,
      },
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
  });
});
