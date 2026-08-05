import Product from "../../models/productModel.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// @desc    Get single product details
// @route   GET /api/v1/product/:id
export const getSingleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
