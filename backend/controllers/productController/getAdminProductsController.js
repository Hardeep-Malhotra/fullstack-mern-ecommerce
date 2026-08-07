import asyncHandler from "../../middlewares/asyncHandler.js";
import Product from "../../models/productModel.js";
// @desc    Get all products for Admin Dashboard
// @route   GET /api/v1/admin/products
// @access  Private (Admin Only)
export const getAdminProducts = asyncHandler(async (req, res, next) => {
  // Direct saare products find karo jo is admin ne banaye hain
  const products = await Product.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    totalProducts: products.length,
    products,
  });
});
