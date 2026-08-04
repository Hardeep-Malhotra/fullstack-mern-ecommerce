import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product Successfully Deleted",
    product,
  });
});