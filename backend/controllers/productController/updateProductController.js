import Product from "../../models/productModel.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";

// @desc    Update single product details
// @route   PUT /api/v1/products/:id
export const updateProduct = asyncHandler(async (req, res, next) => {
  // Step 1: Check if product exists in DB
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found with this ID", 404));
  }

  // Step 2: Update Product
  // { new: true } -> Updated document return karega
  // { runValidators: true } -> Schema validation update time par bhi execute karega
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    product,
  });
});